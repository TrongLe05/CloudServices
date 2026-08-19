using MediatR;

namespace CloudServices.Application.Features.Users.Queries.GetMe;

public sealed record GetMeQuery(Guid userId) : IRequest<GetMeResponse>;
