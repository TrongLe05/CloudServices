using MediatR;

namespace CloudServices.Application.Features.ExportOrderRequests.Queries;

public sealed record ExportOrderRequestsQuery(string? Search, string? Status) : IRequest<byte[]>;
