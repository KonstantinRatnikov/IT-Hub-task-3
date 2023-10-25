using System;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class Note
    {
        [Key]
        public int NoteId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
