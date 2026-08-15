namespace CloudServices.Application.Features.ServicePlans.Queries;
internal static class ServicePlanMapper
{ internal static ServicePlanDto ToDto(Domain.Entities.ServicePlan plan) => new(plan.Id, plan.CategoryId, plan.Category?.Name, plan.Name, plan.Description, plan.Cpu, plan.Ram, plan.Storage, plan.Bandwidth, plan.QrCodeUrl, plan.CreatedAt); }
