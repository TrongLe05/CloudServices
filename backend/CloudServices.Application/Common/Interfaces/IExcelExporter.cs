using CloudServices.Domain.Entities;

namespace CloudServices.Application.Common.Interfaces;

public interface IExcelExporter
{
    byte[] ExportOrderRequests(IEnumerable<OrderRequest> orderRequests);
    byte[] ExportAffiliateApplications(IEnumerable<AffiliateApplication> affiliates);
}
