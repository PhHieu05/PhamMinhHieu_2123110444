using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhamMinhHieu_2123110444.Data;
using PhamMinhHieu_2123110444.Models;

namespace PhamMinhHieu_2123110444.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GradesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GradesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Grades
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Grade>>> GetGrades()
        {
            // Sử dụng Include để lấy kèm thông tin Tên sinh viên và Tên môn học
            return await _context.Grades
                .Include(g => g.Student)
                .Include(g => g.Subject)
                .ToListAsync();
        }

        // GET: api/Grades/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Grade>> GetGrade(int id)
        {
            var grade = await _context.Grades
                .Include(g => g.Student)
                .Include(g => g.Subject)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (grade == null) return NotFound();
            return grade;
        }

        // POST: api/Grades (Nhập điểm)
        [HttpPost]
        public async Task<ActionResult<Grade>> PostGrade(Grade grade)
        {
            // Kiểm tra điểm số hợp lệ từ 0 đến 10
            if (grade.Mark < 0 || grade.Mark > 10)
            {
                return BadRequest(new { message = "Điểm số phải nằm trong khoảng từ 0 đến 10." });
            }

            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGrade), new { id = grade.Id }, grade);
        }

        // PUT: api/Grades/5 (Cập nhật điểm)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGrade(int id, Grade grade)
        {
            if (id != grade.Id) return BadRequest();

            // Kiểm tra điểm số hợp lệ từ 0 đến 10
            if (grade.Mark < 0 || grade.Mark > 10)
            {
                return BadRequest(new { message = "Điểm số phải nằm trong khoảng từ 0 đến 10." });
            }

            _context.Entry(grade).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Grades.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Grades/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGrade(int id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null) return NotFound();

            _context.Grades.Remove(grade);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // API Mở rộng: Tính điểm trung bình cho 1 sinh viên
        [HttpGet("average/{studentId}")]
        public async Task<ActionResult<object>> GetAverage(int studentId)
        {
            var grades = await _context.Grades.Where(g => g.StudentId == studentId).ToListAsync();
            if (!grades.Any()) return NotFound(new { message = "Sinh viên chưa có cột điểm nào." });

            var average = grades.Average(g => g.Mark);
            return Ok(new { StudentId = studentId, AverageMark = Math.Round(average, 2) });
        }

        // GET: api/Grades/student/5
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<Grade>>> GetStudentGrades(int studentId)
        {
            return await _context.Grades
                .Include(g => g.Subject)
                .Where(g => g.StudentId == studentId)
                .ToListAsync();
        }
    }
}