using CloudServices.Application.Features.OrderRequests.Commands.CreateOrderRequest;
using FluentValidation.TestHelper;
using Xunit;

namespace CloudServices.Application.Tests;

public class OrderRequestFeatureTests
{
    [Fact]
    public void CreateOrderRequestCommandValidator_Should_Require_Required_Fields()
    {
        var validator = new CreateOrderRequestCommandValidator();
        var command = new CreateOrderRequestCommand
        {
            ServicePlanId = Guid.Empty,
            BillingCycle = string.Empty,
            CustomerName = string.Empty,
            Email = "invalid-email",
            Phone = string.Empty,
            CompanyName = string.Empty
        };

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.ServicePlanId);
        result.ShouldHaveValidationErrorFor(x => x.BillingCycle);
        result.ShouldHaveValidationErrorFor(x => x.CustomerName);
        result.ShouldHaveValidationErrorFor(x => x.Email);
        result.ShouldHaveValidationErrorFor(x => x.Phone);
    }
}
