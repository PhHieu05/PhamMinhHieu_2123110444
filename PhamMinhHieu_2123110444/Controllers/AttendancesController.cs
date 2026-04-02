using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhamMinhHieu_2123110444.Data;
using PhamMinhHieu_2123110444.Models;

namespace PhamMinhHieu_2123110444.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendancesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendancesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Attendances
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendances()
        {
            return await _context.Attendances
                .Include(a => a.Student)
                .ToListAsync();
        }

        // POST: api/Attendances (Điểm danh học sinh)
        [HttpPost]
        public async Task<ActionResult<Attendance>> PostAttendance(Attendance attendance)
        {
            // Nếu không nhập ngày, mặc định lấy ngày hiện tại
            if (attendance.Date == default)
            {
                attendance.Date = DateTime.Now;
            }

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttendances", new { id = attendance.Id }, attendance);
        }

        // GET: api/Attendances/student/5 (Xem lịch sử điểm danh của 1 học sinh)
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetStudentAttendance(int studentId)
        {
            return await _context.Attendances
                .Where(a => a.StudentId == studentId)
                .OrderByDescending(a => a.Date)
                .ToListAsync();
        }

        // DELETE: api/Attendances/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendance(int id)
        {
            var attendance = await _context.Attendances.FindAsync(id);
            if (attendance == null) return NotFound();

            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}