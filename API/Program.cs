using Microsoft.EntityFrameworkCore;
using Persistence;
using API.Extensions;
using API.Middleware;
using Serilog;
using Serilog.Events;
using Microsoft.AspNetCore.HttpLogging;

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

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);

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

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

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

// Cleanup unused code, this will be destroyed once we have used

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    Log.Information("Starting application");
    var context = services.GetRequiredService<DataContext>();

    // Migrate DB
    await context.Database.MigrateAsync();
    Log.Information("Database migrated successfully");

    // Test database connection
    await context.Database.CanConnectAsync();
    Log.Information("Database connected successfully");

    // Seed DB
    await Seed.SeedData(context);
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
