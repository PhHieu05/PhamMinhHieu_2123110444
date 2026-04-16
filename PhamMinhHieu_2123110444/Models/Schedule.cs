using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhamMinhHieu_2123110444.Models
{
    public class Schedule
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ClassId { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [Required]
        [StringLength(20)]
        public string DayOfWeek { get; set; } = string.Empty; // Monday, Tuesday...

        [Required]
        [StringLength(50)]
        public string TimeSlot { get; set; } = string.Empty; // 07:30 - 09:30

        [StringLength(50)]
        public string Room { get; set; } = string.Empty;

        [ForeignKey("ClassId")]
        public Class? Class { get; set; }

        [ForeignKey("SubjectId")]
        public Subject? Subject { get; set; }
    }
}
