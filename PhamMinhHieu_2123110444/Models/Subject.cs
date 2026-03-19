using System.ComponentModel.DataAnnotations;

namespace PhamMinhHieu_2123110444.Models
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string SubjectName { get; set; } = string.Empty;

        [Range(1, 10)] // Giới hạn số tín chỉ từ 1 đến 10
        public int Credits { get; set; }
    }
}