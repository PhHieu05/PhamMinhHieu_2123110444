using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhamMinhHieu_2123110444.Data;
using PhamMinhHieu_2123110444.Models;

namespace PhamMinhHieu_2123110444.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(User user)
        {
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
            {
                return BadRequest("Username already exists");
            }

            // In a real app we would hash the password.
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDto loginDto)
        {
            // 1. Thử tìm theo Username truyền thống (Admin hoặc User đã có)
            var user = await _context.Users
                .Include(u => u.Student)
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username && u.Password == loginDto.Password);
            
            // 2. Nếu không tìm thấy, thử tìm theo StudentCode (dành cho sinh viên đăng nhập lần đầu)
            if (user == null)
            {
                var student = await _context.Students.FirstOrDefaultAsync(s => s.StudentCode == loginDto.Username);
                if (student != null && loginDto.Password == "123")
                {
                    // Kiểm tra xem đã có User nào liên kết với Student này chưa
                    user = await _context.Users.FirstOrDefaultAsync(u => u.StudentId == student.Id);
                    
                    if (user == null)
                    {
                        // Nếu chưa có, tự động tạo tài khoản User cho sinh viên này
                        user = new User
                        {
                            Username = student.StudentCode,
                            Password = "123",
                            FullName = student.FullName,
                            Role = "Student",
                            StudentId = student.Id
                        };
                        _context.Users.Add(user);
                        await _context.SaveChangesAsync();
                        
                        // Lấy lại user kèm Student info
                        user = await _context.Users
                            .Include(u => u.Student)
                            .FirstOrDefaultAsync(u => u.Id == user.Id);
                    }
                    else if (user.Password != loginDto.Password)
                    {
                        return Unauthorized("Sai mật khẩu cho mã sinh viên này");
                    }
                }
            }
            
            if (user == null)
            {
                return Unauthorized("Tên đăng nhập hoặc Mã sinh viên không tồn tại");
            }

            return Ok(new { 
                token = "token-" + Guid.NewGuid().ToString(), 
                user = new { 
                    user.Id, 
                    user.Username, 
                    user.FullName, 
                    user.Role, 
                    user.StudentId,
                    classId = user.Student?.ClassId
                }
            });
        }
    }

    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
