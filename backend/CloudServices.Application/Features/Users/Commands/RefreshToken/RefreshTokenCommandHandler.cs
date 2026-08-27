using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using CloudServices.Domain.Entities;
using MediatR;
using System.Security.Claims;

namespace CloudServices.Application.Features.Users.Commands.RefreshToken;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenCommandResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenCommandHandler(
        IUserRepository userRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<RefreshTokenCommandResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            throw new UnauthorizedException("Refresh Token không được để trống.");
        }

        AppUser? user = null;

        // 1. Bước 1: Ưu tiên tìm user trực tiếp từ RefreshToken / PreviousRefreshToken trong cơ sở dữ liệu
        user = await _userRepository.GetByRefreshTokenAsync(request.RefreshToken, cancellationToken);

        // 2. Bước 2: Nếu chưa tìm thấy và có ExpiredAccessToken, thử trích xuất UserId từ Claims (Fallback)
        if (user == null && !string.IsNullOrWhiteSpace(request.ExpiredAccessToken))
        {
            try
            {
                var principal = _jwtTokenGenerator.GetPrincipalFromExpiredToken(request.ExpiredAccessToken);
                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                  ?? principal.FindFirst("sub")?.Value;

                if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var userId))
                {
                    user = await _userRepository.GetByIdAsync(userId, cancellationToken);
                }
            }
            catch
            {
                // Bỏ qua lỗi giải mã token nếu token đã quá hạn hoặc đổi định dạng
            }
        }

        if (user == null)
        {
            throw new UnauthorizedException("Phiên làm việc không tồn tại hoặc đã hết hạn. Vui lòng đăng nhập lại.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedException("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        // 3. Kiểm tra Refresh Token
        // Trường hợp A: Khớp với RefreshToken hiện tại và chưa hết hạn -> Tiến hành Rotate Token
        if (user.RefreshToken == request.RefreshToken && user.RefreshTokenExpiryTime > DateTime.UtcNow)
        {
            var newAccessToken = _jwtTokenGenerator.GenerateToken(user);
            var newRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

            // Lưu lại token cũ vào PreviousRefreshToken với thời hạn bằng thời hạn phiên hiện tại (tối đa 7 ngày)
            // để hỗ trợ multi-tab, serverless concurrency và browser đóng mở lại sau thời gian dài
            user.PreviousRefreshToken = user.RefreshToken;
            user.PreviousRefreshTokenExpiryTime = user.RefreshTokenExpiryTime;

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // Gia hạn 7 ngày

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new RefreshTokenCommandResponse(newAccessToken, newRefreshToken, user.Username);
        }

        // Trường hợp B: Khớp với PreviousRefreshToken và vẫn nằm trong thời gian ân hạn (do các request đồng thời từ Next.js)
        if (!string.IsNullOrEmpty(user.PreviousRefreshToken) &&
            user.PreviousRefreshToken == request.RefreshToken &&
            user.PreviousRefreshTokenExpiryTime > DateTime.UtcNow)
        {
            // Trả về AccessToken mới cùng RefreshToken đang hoạt động để client đồng bộ lại
            var newAccessToken = _jwtTokenGenerator.GenerateToken(user);
            return new RefreshTokenCommandResponse(newAccessToken, user.RefreshToken ?? request.RefreshToken, user.Username);
        }

        // Trường hợp C: Refresh Token không hợp lệ hoặc đã quá hạn
        throw new UnauthorizedException("Refresh Token không hợp lệ hoặc đã hết hạn.");
    }
}