using Microsoft.AspNetCore.Mvc;
using PhamMinhHieu_2123110444.Data;
using PhamMinhHieu_2123110444.Models;

namespace PhamMinhHieu_2123110444.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SeedController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SeedData()
        {
            try
            {
                bool modifications = false;
                
                // Thêm Classes mẫu nếu chưa có
                if (!_context.Classes.Any())
                {
                    _context.Classes.AddRange(
                        new Class { ClassName = "Công nghệ thông tin 1", SchoolYear = "2023-2027" },
                        new Class { ClassName = "Khoa học máy tính 2", SchoolYear = "2023-2027" }
                    );
                    modifications = true;
                }

                // Thêm Subjects mẫu nếu chưa có
                if (!_context.Subjects.Any())
                {
                    _context.Subjects.AddRange(
                        new Subject { SubjectName = "Lập trình Web nâng cao", Credits = 3 },
                        new Subject { SubjectName = "Cấu trúc dữ liệu và giải thuật", Credits = 4 }
                    );
                    modifications = true;
                }

                if (modifications)
                {
                    await _context.SaveChangesAsync(); // Cần lưu Class trước để lấy ID
                }

                // Thêm Students mẫu nếu chưa có
                if (!_context.Students.Any())
                {
                    var class1 = _context.Classes.FirstOrDefault();
                    if (class1 != null)
                    {
                        _context.Students.AddRange(
                            new Student { StudentCode = "SV001", FullName = "Nguyễn Văn A", Birthday = new DateTime(2003, 1, 15), ClassId = class1.Id },
                            new Student { StudentCode = "SV002", FullName = "Trần Thị B", Birthday = new DateTime(2004, 5, 20), ClassId = class1.Id },
                            new Student { StudentCode = "SV003", FullName = "Lê Hoàng C", Birthday = new DateTime(2003, 12, 5), ClassId = class1.Id }
                        );
                        await _context.SaveChangesAsync();
                        modifications = true;
                    }
                }

                if (modifications)
                {
                    return Ok(new { message = "Seeded data successfully!" });
                }
                
                return Ok(new { message = "Data already exists. No new seed data added." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error seeding data: {ex.Message}");
            }
        }
    }
}
