using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhamMinhHieu_2123110444.Models
{
    public class Grade
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [Required]
        [Range(0, 10)]
        public double Mark { get; set; } // Sử dụng double để nhập điểm lẻ như 7.5

        [Required]
        [StringLength(50)]
        public string Type { get; set; } // Ví dụ: 15p, Giữa kỳ, Cuối kỳ

        [Required]
        public int Semester { get; set; } // Học kỳ 1 hoặc 2

        // Thiết lập mối quan hệ (Navigation Properties)
        [ForeignKey("StudentId")]
        public Student? Student { get; set; }

        [ForeignKey("SubjectId")]
        public Subject? Subject { get; set; }
    }
}