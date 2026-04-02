using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhamMinhHieu_2123110444.Data;
using PhamMinhHieu_2123110444.Models;

namespace PhamMinhHieu_2123110444.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubjectsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Subjects (Lấy danh sách tất cả môn học)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subject>>> GetSubjects()
        {
            return await _context.Subjects.ToListAsync();
        }

        // 2. GET: api/Subjects/5 (Lấy thông tin 1 môn học theo ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<Subject>> GetSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);

            if (subject == null)
            {
                return NotFound(new { message = "Không tìm thấy môn học này." });
            }

            return subject;
        }

        // 3. POST: api/Subjects (Thêm môn học mới)
        [HttpPost]
        public async Task<ActionResult<Subject>> PostSubject(Subject subject)
        {
            // Kiểm tra tính hợp lệ của dữ liệu (ví dụ: Số tín chỉ không được âm)
            if (subject.Credits <= 0)
            {
                return BadRequest(new { message = "Số tín chỉ phải lớn hơn 0." });
            }

            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, subject);
        }

        // 4. PUT: api/Subjects/5 (Cập nhật thông tin môn học)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubject(int id, Subject subject)
        {
            if (id != subject.Id)
            {
                return BadRequest(new { message = "ID không khớp." });
            }

            _context.Entry(subject).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubjectExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // 5. DELETE: api/Subjects/5 (Xóa môn học)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
            {
                return NotFound();
            }

            // Kiểm tra xem môn học này có đang được dùng trong bảng Grade (Điểm) không
            // Nếu có, không nên cho xóa để tránh lỗi dữ liệu.
            var hasGrades = await _context.Grades.AnyAsync(g => g.SubjectId == id);
            if (hasGrades)
            {
                return BadRequest(new { message = "Không thể xóa môn học đã có dữ liệu điểm số." });
            }

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubjectExists(int id)
        {
            return _context.Subjects.Any(e => e.Id == id);
        }
    }
}