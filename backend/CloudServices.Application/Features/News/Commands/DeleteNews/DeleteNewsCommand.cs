using MediatR;

namespace CloudServices.Application.Features.News.Commands.DeleteNews;

public record DeleteNewsCommand(Guid Id) : IRequest;
