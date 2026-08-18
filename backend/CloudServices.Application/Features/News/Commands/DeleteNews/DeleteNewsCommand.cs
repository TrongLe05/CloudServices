using MediatR;
namespace CloudServices.Application.Features.News.Commands.DeleteNews;
public sealed record DeleteNewsCommand(Guid Id) : IRequest;
