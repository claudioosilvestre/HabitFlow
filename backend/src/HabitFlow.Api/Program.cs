using System.Text.Json.Serialization;
using HabitFlow.Api.Handlers;
using HabitFlow.Application.Converters;
using HabitFlow.Application.Interfaces;
using HabitFlow.Application.Services;
using HabitFlow.Infrastructure.Persistence;
using HabitFlow.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5089")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddControllers()
.AddJsonOptions(options =>
{
options.JsonSerializerOptions.Converters.Add(
new JsonStringEnumConverter());
});

builder.Services.AddScoped<IHabitRepository, HabitRepository>();
builder.Services.AddScoped<IHabitRecordRepository, HabitRecordRepository>();
builder.Services.AddScoped<IHabitService, HabitService>();
builder.Services.AddScoped<IHabitRecordService, HabitRecordService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IHabitConverter, HabitConverter>();
builder.Services.AddScoped<IHabitRecordConverter, HabitRecordConverter>();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddProblemDetails();


var app = builder.Build();

app.UseExceptionHandler();
app.UseCors("DevPolicy");

app.MapControllers();

app.Run();