using MediatR;

namespace CloudServices.Application.Features.Users.Queries.GetUsers;
public record GetUsersQuery : IRequest<List<UserDto>>;