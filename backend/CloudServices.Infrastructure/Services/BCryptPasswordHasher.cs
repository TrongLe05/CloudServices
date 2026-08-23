using CloudServices.Application.Common.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace CloudServices.Infrastructure.Services;

public class BCryptPasswordHasher : IPasswordHasher
{
    public string HashPasswords(string password)
    {
       return BC.HashPassword(password);
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        return BC.Verify(password, hashedPassword);
    }
}

