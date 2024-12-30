using Microsoft.EntityFrameworkCore;
using Persistence;
using API.Extensions;
using API.Middleware;
using Serilog;
using Serilog.Events;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Identity;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.SignalR;

var builder = WebApplication.CreateBuilder(args);
// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console(
        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}",
        theme: Serilog.Sinks.SystemConsole.Themes.AnsiConsoleTheme.Code)
    .CreateLogger();

builder.Host.UseSerilog(); // Use Serilog for logging

// Add services to the container.

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

// Add HTTP logging
builder.Services.AddHttpLogging(logging =>
{
    logging.LoggingFields = HttpLoggingFields.All;
    logging.RequestHeaders.Add("sec-ch-ua");
    logging.ResponseHeaders.Add("MyResponseHeader");
    logging.MediaTypeOptions.AddText("application/javascript");
    logging.RequestBodyLogLimit = 4096;
    logging.ResponseBodyLogLimit = 4096;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// app.UseDeveloperExceptionPage();

app.UseMiddleware<ExceptionMiddleware>();

app.UseXContentTypeOptions(); // Prevent MIME type sniffing

app.UseReferrerPolicy(opt => opt.NoReferrer()); // Prevent referrer policy

app.UseXXssProtection(opt => opt.EnabledWithBlockMode()); // Prevent XSS attacks

app.UseXfo(opt => opt.Deny()); // Prevent clickjacking

app.UseCsp(opt => opt
    .BlockAllMixedContent()
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
    .ImageSources(s => s.Self().CustomSources("blob:", "https://res.cloudinary.com"))
    .FrameAncestors(s => s.Self())
    .FormActions(s => s.Self())
    .ScriptSources(s => s.Self())
    .ScriptSources(s => s.Self())
);


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.Use(async (context, next) =>
    {
        //add HSTS header to response for 1 year
        context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

        await next.Invoke();
    });
}

app.UseHttpsRedirection();


app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("CorsPolicy");

// Add HTTP logging middleware
app.UseHttpLogging();

// Add custom middleware to log requests and responses
app.Use(async (context, next) =>
{
    Log.Information($"Request: {context.Request.Method} {context.Request.Path}");
    await next();
    Log.Information($"Response: {context.Response.StatusCode}");
});

app.MapControllers();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index", "Fallback");

// Cleanup unused code, this will be destroyed once we have used

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    Log.Information("Starting application");
    var context = services.GetRequiredService<DataContext>();

    var userManager = services.GetRequiredService<UserManager<AppUser>>();

    // Migrate DB
    await context.Database.MigrateAsync();
    Log.Information("Database migrated successfully");

    // Test database connection
    await context.Database.CanConnectAsync();
    Log.Information("Database connected successfully");

    // Seed DB
    await Seed.SeedData(context, userManager);
    Log.Information("Database seeded successfully");

    var serverAddresses = app.Urls;
    Log.Information("Application is listening at: {Addresses}", string.Join(", ", serverAddresses));
}
catch (Exception ex)
{
    Log.Fatal(ex, "An error occurred during startup");
}

app.Run();

// Ensure all logs are flushed
Log.CloseAndFlush();
