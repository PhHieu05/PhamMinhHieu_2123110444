using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhamMinhHieu_2123110444.Data;
using PhamMinhHieu_2123110444.Models;

namespace PhamMinhHieu_2123110444.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TuitionFeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TuitionFeesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TuitionFee>>> GetAllFees()
        {
            return await _context.TuitionFees
                .Include(t => t.Student)
                .OrderByDescending(t => t.Id)
                .ToListAsync();
        }

        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<TuitionFee>>> GetStudentFees(int studentId)
        {
            var fees = await _context.TuitionFees
                .Where(t => t.StudentId == studentId)
                .ToListAsync();

            if (!fees.Any())
            {
                // Auto calculate and generate fee for the student based on their class schedule
                var student = await _context.Students.FindAsync(studentId);
                if (student != null)
                {
                    var schedules = await _context.Schedules
                        .Include(s => s.Subject)
                        .Where(s => s.ClassId == student.ClassId)
                        .ToListAsync();
                    
                    if (schedules.Any())
                    {
                        // Get distinct subjects from schedule
                        var subjects = schedules.Select(s => s.Subject).Distinct().Where(s => s != null).ToList();
                        int totalCredits = subjects.Sum(s => s!.Credits);
                        decimal totalAmount = totalCredits * 450000;

                        var newFee = new TuitionFee
                        {
                            StudentId = studentId,
                            TotalCredits = totalCredits,
                            TotalAmount = totalAmount,
                            IsPaid = false,
                            Semester = "Học kỳ 2, Năm học 2023-2024"
                        };
                        _context.TuitionFees.Add(newFee);
                        await _context.SaveChangesAsync();
                        fees.Add(newFee);
                    }
                }
            }

            return fees;
        }
        
        [HttpPut("{id}/pay")]
        public async Task<IActionResult> PayFee(int id)
        {
            var fee = await _context.TuitionFees.FindAsync(id);
            if (fee == null) return NotFound();
            
            fee.IsPaid = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
