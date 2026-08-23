using MediatR;

namespace CloudServices.Application.Features.ExportAffiliates;

public record ExportAffiliatesQuery(string? Search, string? Status) : IRequest<byte[]>;