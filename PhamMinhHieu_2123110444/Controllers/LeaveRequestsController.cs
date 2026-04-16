using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhamMinhHieu_2123110444.Data;
using PhamMinhHieu_2123110444.Models;

namespace PhamMinhHieu_2123110444.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaveRequestsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaveRequests()
        {
            return await _context.LeaveRequests
                .Include(l => l.Student)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }

        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetStudentRequests(int studentId)
        {
            return await _context.LeaveRequests
                .Where(l => l.StudentId == studentId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LeaveRequest>> GetLeaveRequest(int id)
        {
            var request = await _context.LeaveRequests.Include(l => l.Student).FirstOrDefaultAsync(l => l.Id == id);
            if (request == null) return NotFound();
            return request;
        }

        [HttpPost]
        public async Task<ActionResult<LeaveRequest>> PostLeaveRequest(LeaveRequest request)
        {
            request.CreatedAt = DateTime.Now;
            request.Status = "Pending";
            _context.LeaveRequests.Add(request);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetLeaveRequest), new { id = request.Id }, request);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var request = await _context.LeaveRequests.FindAsync(id);
            if (request == null) return NotFound();

            request.Status = status;
            await _context.SaveChangesAsync();

            // Nếu duyệt thành công (Approved), tự động tạo bản ghi điểm danh
            if (status == "Approved")
            {
                var attendance = new Attendance
                {
                    StudentId = request.StudentId,
                    Date = request.LeaveDate,
                    Status = "P", // P for Permitted absence
                    Note = "Nghỉ học có phép: " + request.Reason
                };
                _context.Attendances.Add(attendance);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            var request = await _context.LeaveRequests.FindAsync(id);
            if (request == null) return NotFound();
            _context.LeaveRequests.Remove(request);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
