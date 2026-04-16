using System.ComponentModel.DataAnnotations;

namespace PhamMinhHieu_2123110444.Models
{
    public class Class
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string ClassName { get; set; } = string.Empty;

        [StringLength(20)]
        public string SchoolYear { get; set; } = string.Empty; // Ví dụ: 2023-2027

        // Quan hệ 1-N: Một lớp có nhiều sinh viên
        public ICollection<Student> Students { get; set; } = new List<Student>();
    }
}