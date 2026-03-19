using Microsoft.EntityFrameworkCore;
using PhamMinhHieu_2123110444.Models;

namespace PhamMinhHieu_2123110444.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        { }
        public DbSet<Student> Students { get; set; }
    }
}
