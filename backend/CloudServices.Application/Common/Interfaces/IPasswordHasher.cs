namespace CloudServices.Application.Common.Interfaces;

public interface IPasswordHasher 
{
    // Mã hoá mật khẩu thành chuỗi băm
    string HashPasswords(string password);
    // Xác thực mật khẩu thô với mật khẩu băm trong DB
    bool VerifyPassword(string password, string hashedPassword);
}
