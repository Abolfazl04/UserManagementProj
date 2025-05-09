using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UserManagementProj.Models;
public class UserDbContext(DbContextOptions<UserDbContext> options) : DbContext(options) 
    {
        public DbSet<User> Users { get; set; }
    public DbSet<UserManagementProj.Models.UserDTO> UserDTO { get; set; } = default!;
    }

