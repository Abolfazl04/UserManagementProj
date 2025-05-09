using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace UserManagementProj.Models
{
    public class UserDTO 
    {
        public string Id { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format")]

        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MinLength(8)]
        [PasswordPropertyText(true)]
        public string Password { get; set; } = string.Empty;
    }
}
