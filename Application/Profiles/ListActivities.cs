using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {

        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public UserActivityParam Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            /* get a list of activities for a user */

            /* Allow the user to filter the activities by predicate */

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                  .Where(u => u.AppUser.UserName == request.Username)
                    .OrderBy(a => a.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider, new { username = request.Username })
                    .AsQueryable();


                query = request.Params.Predicate switch
                {
                    "past" => query.Where(a => a.Date < DateTime.UtcNow),

                    "hosting" => query.Where(a => a.HostUsername == request.Username),

                    _ => query.Where(a => a.Date >= DateTime.UtcNow)
                };

                var activities = await query.ToListAsync(cancellationToken);

                return Result<List<UserActivityDto>>.Success(activities);
            }
        }



    }
}