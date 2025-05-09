using Azure.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserManagementProj.Models;

namespace UserManagementProj.Services
{
    public class AuthService (UserDbContext Context , IConfiguration Configuration): IAuthService
    {
    
        
        public async Task<string?> LoginAsync(UserDTO Request)
        {
            var user = await Context.Users.FirstOrDefaultAsync(e => e.Email.ToLower() == Request.Email.ToLower());
            if (user is null)
            {
                return null;
            }
            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, Request.Password)
                == PasswordVerificationResult.Failed)
            {
                return null;
            }
            
            return CreateToken(user);
        }

        public async Task<UserDTO?> RegisterAsync(UserDTO Request)
        {
            if (await Context.Users.AnyAsync(e => e.Email.ToLower() == Request.Email.ToLower()))
            {
                return null;
            }
            var user = new User();
          
            user.Role = "User";
            user.Email = Request.Email;
            user.PasswordHash = new PasswordHasher<User>()
                .HashPassword(user, Request.Password);
            Context.Users.Add(user);
            await Context.SaveChangesAsync();
            return Request;
        }
        private String CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim (ClaimTypes.Email, user.Email),
                new Claim (ClaimTypes.NameIdentifier, user.Id),
                new Claim("role", user.Role)


            };
            var Key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(Configuration.GetValue<String>("AppSettings:Token")!));
            var Creds = new SigningCredentials(Key, SecurityAlgorithms.HmacSha512);
            var TokenDescriptor = new JwtSecurityToken(
                issuer: Configuration.GetValue<String>("AppSettings:Issuer"),
                audience: Configuration.GetValue<String>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: Creds
                );
            return new JwtSecurityTokenHandler().WriteToken(TokenDescriptor);
        }
       
       
    }
}
