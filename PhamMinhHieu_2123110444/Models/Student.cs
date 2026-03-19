using System.ComponentModel.DataAnnotations;

namespace PhamMinhHieu_2123110444.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(20)]
        public string StudentCode { get; set; } = string.Empty;
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;
        public DateTime Birthday { get; set; }
    }
}
