namespace CloudServices.Application.Features.Users.Queries.GetMe;

public sealed record GetMeResponse(Guid Id, string Username, string Email, string FullName, string AvatarUrl, string Role, bool Status);