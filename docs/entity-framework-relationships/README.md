# Entity Framework Relationships and Infrastructure Project

## 1. Entity Framework Relationships

### One-to-Many Relationships

- One entity can have multiple related entities (e.g., a user can have many photos)
- EF Core configures these by convention
- Example:

  ```csharp
  public class User
  {
      public int Id { get; set; }
      public string Name { get; set; }
      public ICollection<Photo> Photos { get; set; }
  }

  public class Photo
  {
      public int Id { get; set; }
      public string Url { get; set; }
      public int UserId { get; set; }
      public User User { get; set; }
  }
  ```

### Many-to-Many Relationships

- Multiple entities can be related to multiple entities of another type
- In this project: Users can attend many activities, and activities can have many attendees
- Custom join table used for flexibility:
  ```csharp
  public class ActivityAttendee
  {
      public string AppUserId { get; set; }
      public AppUser AppUser { get; set; }
      public Guid ActivityId { get; set; }
      public Activity Activity { get; set; }
      public bool IsHost { get; set; }
  }
  ```

### One-to-One Relationships

- One entity is related to exactly one instance of another entity
- EF Core can handle these by convention

## 2. Adding an Infrastructure Project

### Purpose

- Maintains clean architecture principles
- Implements interfaces defined in the application layer
- Keeps the application layer independent of authentication concerns

### User Accessor

- Interface defined in application layer:
  ```csharp
  public interface IUserAccessor
  {
      string GetUsername();
  }
  ```
- Implementation in infrastructure project:

  ```csharp
  public class UserAccessor : IUserAccessor
  {
      private readonly IHttpContextAccessor _httpContextAccessor;

      public UserAccessor(IHttpContextAccessor httpContextAccessor)
      {
          _httpContextAccessor = httpContextAccessor;
      }

      public string GetUsername()
      {
          return _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
      }
  }
  ```

## 3. Authorization Policy

### Steps to Create an Authorization Handler

1. Create a Requirement Class:

   ```csharp
   public class IsHostRequirement : IAuthorizationRequirement
   {
       // This can be empty if no additional data is needed
   }
   ```

2. Create a Handler Class:

   ```csharp
   public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
   {
       private readonly DataContext _dbContext;
       private readonly IHttpContextAccessor _httpContextAccessor;

       public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
       {
           _httpContextAccessor = httpContextAccessor;
           _dbContext = dbContext;
       }

       protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
       {
           // Implementation goes here
       }
   }
   ```

3. Implement the Handler Logic:

   - Get the user ID from the claims
   - Get the activity ID from the route values
   - Check if the user is the host of the activity
   - If yes, call `context.Succeed(requirement)`

4. Register the Policy and Handler:

   ```csharp
   services.AddAuthorization(opt =>
   {
       opt.AddPolicy("IsActivityHost", policy =>
       {
           policy.Requirements.Add(new IsHostRequirement());
       });
   });
   services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
   ```

5. Use the Policy in Controllers:
   ```csharp
   [Authorize(Policy = "IsActivityHost")]
   [HttpPut("{id}")]
   public async Task<IActionResult> EditActivity(Guid id, Activity activity)
   {
       // Implementation
   }
   ```

### Importance of AsNoTracking()

- Used in the authorization handler due to its transient scope
- Prevents issues with Entity Framework's change tracking
- Ensures fresh data is always used for authorization checks
- Avoids conflicts with subsequent edit operations
- Improves performance for read-only operations

## 4. Loading Related Data

### Eager Loading

- Loads related entities along with the main entity in a single query
- Example:
  ```csharp
  var activities = await _context.Activities
      .Include(a => a.Attendees)
          .ThenInclude(u => u.AppUser)
      .ToListAsync();
  ```

### Lazy Loading

- Automatically loads related entities when accessed
- Not recommended due to potential performance issues

### Projection (Using AutoMapper)

- Maps entities to DTOs while loading, optimizing the query
- Example:
  ```csharp
  var activities = await _context.Activities
      .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
      .ToListAsync();
  ```

## 5. Optimizing SQL Queries

- Use projection to select only needed fields
- Avoid unnecessary eager loading
- Use `AsNoTracking()` for read-only queries

## 6. AutoMapper Configuration

```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Activity, ActivityDto>()
            .ForMember(d => d.HostUsername, o => o.MapFrom(s =>
                s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

        CreateMap<ActivityAttendee, Profiles.Profile>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
    }
}
```
