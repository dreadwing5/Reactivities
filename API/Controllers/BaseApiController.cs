using MediatR;
using Microsoft.AspNetCore.Mvc;



/*
WTH is this?
 ??=

*/
namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {

        protected IMediator Mediator => HttpContext.RequestServices.GetService<IMediator>();

    }
}