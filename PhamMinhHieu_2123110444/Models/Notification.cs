using System;
using System.ComponentModel.DataAnnotations;

namespace PhamMinhHieu_2123110444.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [StringLength(50)]
        public string Category { get; set; } = "General"; // General, Exam, Holiday
    }
}
