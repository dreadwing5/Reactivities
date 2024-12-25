using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment.Value);


        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];

            // Add the user to the group
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

            // Load the comments for the activity
            var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });

            // Send the comments to the caller
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}