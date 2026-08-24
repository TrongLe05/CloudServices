using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
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
        // 1. Trích xuất Claims từ Access Token đã hết hạn
        ClaimsPrincipal principal;
        try
        {
            principal = _jwtTokenGenerator.GetPrincipalFromExpiredToken(request.ExpiredAccessToken);
        }
        catch (Exception)
        {
            throw new UnauthorizedException("Access Token không hợp lệ.");
        }

        // 2. Lấy UserId từ Claims (Sub claim)
        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? principal.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedException("Token không chứa thông tin User hợp lệ.");
        }

        // 3. Tìm User trong database (Đã Include Role để generate JWT đầy đủ quyền)
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new UnauthorizedException("User không tồn tại.");
        }

        // 4. Kiểm tra Refresh Token
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