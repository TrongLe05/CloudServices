using CloudServices.Application.Common.Exceptions;
using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;
using System.IdentityModel.Tokens.Jwt;
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
                          ?? principal.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedException("Token không chứa thông tin User hợp lệ.");
        }

        // 3. Tìm User trong database (Nhớ Include Role vì hàm GenerateToken cần nạp Role của User)
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new UnauthorizedException("User không tồn tại.");
        }

        // 4. Kiểm tra xem Refresh Token gửi lên có khớp với Refresh Token trong DB và đã hết hạn chưa
        if (user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new UnauthorizedException("Refresh Token không hợp lệ hoặc đã hết hạn.");
        }

        // 5. Tạo cặp Access Token và Refresh Token mới
        var newAccessToken = _jwtTokenGenerator.GenerateToken(user);
        var newRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        // 6. Cập nhật Refresh Token mới vào database
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // gia hạn thêm 7 ngày

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new RefreshTokenCommandResponse(newAccessToken, newRefreshToken, user.Username);
    }
}