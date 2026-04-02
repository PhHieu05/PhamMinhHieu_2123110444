using Microsoft.EntityFrameworkCore;
using PhamMinhHieu_2123110444.Data;
using System.Text.Json.Serialization; // Thêm th? vi?n này

var builder = WebApplication.CreateBuilder(args);

// 1. C?u hình Connection String
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. C?u hình Controllers và x? lý vòng l?p JSON (Quan tr?ng)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// 3. C?u hình CORS (Cho phép các ?ng d?ng khác g?i API c?a b?n)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", builder => {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 4. S? d?ng CORS ?ã c?u hình ? trên
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();