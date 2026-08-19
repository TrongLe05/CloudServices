using CloudServices.Application.Features.Affiliates.Commands.ChangeAffiliateStatus;
using CloudServices.Application.Features.Affiliates.Commands.CreateAffiliate;
using CloudServices.Application.Features.Affiliates.Commands.DeleteAffiliate;
using CloudServices.Application.Features.Affiliates.Queries.GetAffiliateApplicationById;
using CloudServices.Application.Features.Affiliates.Queries.GetAffiliateApplications;
using CloudServices.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudServices.API.Controllers
{
    public class AffiliatesController : ApiControllerBase
    {
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateAffiliateApplication([FromBody] CreateAffiliateCommand command)
        {
            var id = await Mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> GetAll(string? search, string? status, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await Mediator.Send(new GetAffiliateApplicationsQuery(search, status, page, pageSize), cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetAffiliateApplicationByIdQuery(id), cancellationToken);
            return Ok(result);
        }

        [HttpPatch("{id:guid}/status")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] ChangeAffiliateStatusCommandRequest request, CancellationToken cancellationToken)
        {
            var command = new ChangeAffiliateStatusCommand(id, request.Status);
            await Mediator.Send(command, cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {

            await Mediator.Send(new DeleteAffiliateCommand(id), cancellationToken);
            return NoContent();
        }
    }
}
