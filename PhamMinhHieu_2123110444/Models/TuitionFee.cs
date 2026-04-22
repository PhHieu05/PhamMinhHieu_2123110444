using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhamMinhHieu_2123110444.Models
{
    public class TuitionFee
    {
        [Key]
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int TotalCredits { get; set; }
        public decimal TotalAmount { get; set; } // TotalCredits * 450000
        public bool IsPaid { get; set; }
        public string Semester { get; set; } = string.Empty;

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }
    }
}
