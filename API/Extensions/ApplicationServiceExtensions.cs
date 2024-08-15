using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000"
                    );

                });
            });

            //WTH is this?

            services.AddMediatR(options =>
            {
                options.RegisterServicesFromAssembly(typeof(List.Handler).Assembly);
                options.Lifetime = ServiceLifetime.Scoped;
            });
            services.AddAutoMapper(typeof(MappingProfile).Assembly);

            return services;
        }

    }
}