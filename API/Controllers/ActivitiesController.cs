using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

/* Controller should be thin as possible */

namespace API.Controllers
{
    [AllowAnonymous]
    public class ActivitiesController : BaseApiController
    {

        [HttpGet] //api/activities
        public async Task<IActionResult> GetActivites()

        {
            // WTH is this?

            return HandleResult(await Mediator.Send(new List.Query()));
        }

        // Route Parameter //api/activities/id

        [HttpGet("{id}")]

        public async Task<IActionResult> GetActivity(Guid id)
        {
            var result = await Mediator.Send(new Details.Query { Id = id });

            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            var result = await Mediator.Send(new Create.Command { Activity = activity });

            return HandleResult(result);

        }

        [HttpPut("{id}")]

        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;

            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }

}