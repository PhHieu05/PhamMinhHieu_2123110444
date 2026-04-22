using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public async Task<IActionResult> SeedData([FromQuery] bool force = false)
        {
            try
            {
                if (force)
                {
                    // Clear existing data in correct order due to FK constraints
                    _context.Attendances.RemoveRange(_context.Attendances);
                    _context.Grades.RemoveRange(_context.Grades);
                    _context.Students.RemoveRange(_context.Students);
                    _context.Subjects.RemoveRange(_context.Subjects);
                    _context.Classes.RemoveRange(_context.Classes);
                    _context.Users.RemoveRange(_context.Users); // Xóa sạch người dùng để tạo mới admin và student
                    _context.Schedules.RemoveRange(_context.Schedules);
                    _context.Notifications.RemoveRange(_context.Notifications);
                    await _context.SaveChangesAsync();
                }

                bool modifications = false;

                // 1. Seed Classes
                if (!_context.Classes.Any())
                {
                    _context.Classes.AddRange(
                        new Class { ClassName = "Công nghệ thông tin 1", SchoolYear = "2023-2027" },
                        new Class { ClassName = "Khoa học máy tính 2", SchoolYear = "2023-2027" },
                        new Class { ClassName = "An toàn thông tin 3", SchoolYear = "2024-2028" }
                    );
                    await _context.SaveChangesAsync();
                    modifications = true;
                }

                // 2. Seed Subjects
                if (!_context.Subjects.Any())
                {
                    _context.Subjects.AddRange(
                        new Subject { SubjectName = "Lập trình Web nâng cao", Credits = 3 },
                        new Subject { SubjectName = "Cấu trúc dữ liệu và giải thuật", Credits = 4 },
                        new Subject { SubjectName = "Cơ sở dữ liệu", Credits = 3 },
                        new Subject { SubjectName = "Mạng máy tính", Credits = 3 }
                    );
                    await _context.SaveChangesAsync();
                    modifications = true;
                }

                // 3. Seed Students
                if (!_context.Students.Any())
                {
                    var classIds = _context.Classes.Select(c => c.Id).ToList();
                    if (classIds.Any())
                    {
                        var students = new List<Student>
                        {
                            new Student { StudentCode = "SV001", FullName = "Nguyễn Văn A", Birthday = new DateTime(2003, 1, 15), ClassId = classIds[0] },
                            new Student { StudentCode = "SV002", FullName = "Trần Thị B", Birthday = new DateTime(2004, 5, 20), ClassId = classIds[0] },
                            new Student { StudentCode = "SV003", FullName = "Lê Hoàng C", Birthday = new DateTime(2003, 12, 5), ClassId = classIds[1] },
                            new Student { StudentCode = "SV004", FullName = "Phạm Minh D", Birthday = new DateTime(2005, 3, 10), ClassId = classIds[1] },
                            new Student { StudentCode = "SV005", FullName = "Đỗ Thu E", Birthday = new DateTime(2004, 8, 25), ClassId = classIds[2] }
                        };
                        _context.Students.AddRange(students);
                        await _context.SaveChangesAsync();
                        modifications = true;
                    }
                }

                // 4. Seed Grades
                if (!_context.Grades.Any())
                {
                    var studentIds = _context.Students.Select(s => s.Id).ToList();
                    var subjectIds = _context.Subjects.Select(s => s.Id).ToList();

                    if (studentIds.Any() && subjectIds.Any())
                    {
                        var random = new Random();
                        var grades = new List<Grade>();
                        foreach (var sid in studentIds)
                        {
                            foreach (var subid in subjectIds.Take(2))
                            {
                                grades.Add(new Grade { 
                                    StudentId = sid, 
                                    SubjectId = subid, 
                                    Mark = Math.Round(random.NextDouble() * 10, 1), 
                                    Type = "Final", 
                                    Semester = 1 
                                });
                            }
                        }
                        _context.Grades.AddRange(grades);
                        await _context.SaveChangesAsync();
                        modifications = true;
                    }
                }

                // 5. Seed Attendances
                if (!_context.Attendances.Any())
                {
                    var studentIds = _context.Students.Select(s => s.Id).ToList();
                    if (studentIds.Any())
                    {
                        var attendances = new List<Attendance>();
                        foreach (var sid in studentIds)
                        {
                            attendances.Add(new Attendance { 
                                StudentId = sid, 
                                Date = DateTime.Now.AddDays(-1), 
                                Status = "Có mặt", 
                                Note = "Đúng giờ" 
                            });
                        }
                        _context.Attendances.AddRange(attendances);
                        await _context.SaveChangesAsync();
                        modifications = true;
                    }
                }

                // 6. Seed Users (Admin & Test Student)
                if (!_context.Users.Any())
                {
                    _context.Users.Add(new User { 
                        Username = "admin", 
                        Password = "123", 
                        FullName = "Phòng đào tạo", 
                        Role = "Admin" 
                    });

                    var firstStudent = _context.Students.FirstOrDefault();
                    if (firstStudent != null)
                    {
                        _context.Users.Add(new User { 
                            Username = "student", 
                            Password = "123", 
                            FullName = firstStudent.FullName, 
                            Role = "Student",
                            StudentId = firstStudent.Id
                        });
                    }
                    await _context.SaveChangesAsync();
                    modifications = true;
                }

                // 7. Seed Notifications
                if (!_context.Notifications.Any())
                {
                    _context.Notifications.AddRange(
                        new Notification { Title = "Thông báo nghỉ học kỳ lễ 30/4", Content = "Sinh viên toàn trường được nghỉ từ ngày 23/04 đến hết ngày 10/05...", CreatedAt = DateTime.Now.AddHours(-1), Category = "Holiday" },
                        new Notification { Title = "Lịch thi kết thúc học kỳ 2", Content = "Cập nhật lịch thi chính thức cho các môn học đại cương và chuyên ngành...", CreatedAt = DateTime.Now.AddDays(-1), Category = "Exam" }
                    );
                    await _context.SaveChangesAsync();
                    modifications = true;
                }

                // 8. Seed Schedules
                if (!_context.Schedules.Any())
                {
                    var classId = _context.Classes.Select(c => c.Id).FirstOrDefault();
                    var subjects = _context.Subjects.Take(3).ToList();
                    if (classId != 0 && subjects.Count >= 2)
                    {
                        _context.Schedules.AddRange(
                            new Schedule { ClassId = classId, SubjectId = subjects[0].Id, DayOfWeek = "Thứ 2", TimeSlot = "07:30 - 09:30", Room = "Phòng 402" },
                            new Schedule { ClassId = classId, SubjectId = subjects[1].Id, DayOfWeek = "Thứ 3", TimeSlot = "09:45 - 11:45", Room = "Phòng 105" },
                            new Schedule { ClassId = classId, SubjectId = subjects[2].Id, DayOfWeek = "Thứ 4", TimeSlot = "07:30 - 09:30", Room = "Phòng 301" }
                        );
                        await _context.SaveChangesAsync();
                        modifications = true;
                    }
                }

                if (modifications)
                {
                    return Ok(new { message = "Seeded comprehensive data successfully! Accounts: admin/123, student/123" });
                }
                
                return Ok(new { message = "Data already exists. Use 'force=true' as a query parameter to re-seed." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error seeding data: {ex.Message}");
            }
        }
    }
}
