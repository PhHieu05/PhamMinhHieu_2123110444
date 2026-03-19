using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhamMinhHieu_2123110444.Models
{
    public class Attendance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; } // Ngày điểm danh

        [Required]
        [StringLength(20)]
        public string Status { get; set; } // Ví dụ: Có mặt, Vắng có phép, Vắng không phép

        [StringLength(250)]
        public string? Note { get; set; } // Ghi chú lý do nếu vắng

        // Thiết lập mối quan hệ với bảng Student
        [ForeignKey("StudentId")]
        public Student? Student { get; set; }
    }
}