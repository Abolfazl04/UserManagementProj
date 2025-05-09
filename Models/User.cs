using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace UserManagementProj.Models
{
    public class User : IdentityUser 
    {
        [Required]
        public string Role { get; set; } = string.Empty;
    }

}
