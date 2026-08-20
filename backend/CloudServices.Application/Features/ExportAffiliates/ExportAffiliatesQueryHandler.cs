using CloudServices.Application.Common.Interfaces;
using CloudServices.Application.Common.Interfaces.Repositories;
using MediatR;

namespace CloudServices.Application.Features.ExportAffiliates;

public sealed class ExportAffiliatesQueryHandler(
    IAffiliateApplicationRepository repository,
    IExcelExporter excelExporter) : IRequestHandler<ExportAffiliatesQuery, byte[]>
{
    public async Task<byte[]> Handle(ExportAffiliatesQuery request, CancellationToken cancellationToken)
    {
        var affiliates = await repository.GetAllAsync(cancellationToken);
        return excelExporter.ExportAffiliateApplications(affiliates);
    }
}
