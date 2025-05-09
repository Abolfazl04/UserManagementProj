using System.ComponentModel.DataAnnotations;

namespace UserManagementProj.Models
{
    public class UserUpdateDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(50)]
        public string UserName { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        public bool EmailConfirmed { get; set; }
    }
}
