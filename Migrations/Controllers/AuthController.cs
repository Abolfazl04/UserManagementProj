using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using UserManagementProj.Models;
using UserManagementProj.Services;

namespace UserManagementProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController (IAuthService authService) : ControllerBase
    {
        public static User user { get; set; } = new();
        
            
        

        //Create new User
        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserDTO Request)
        {
           var user = await authService.RegisterAsync(Request);
            if (user == null)
                return BadRequest(new { message = "User Already Exists" }); 

            var token = await authService.LoginAsync(Request);
            return Ok(new { message = "Registration successful", user = Request , token  = token }); 
            
        }

        //Login  
        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login(UserDTO Request)
        {
            var token = await authService.LoginAsync(Request);
            if (token is null)
                return BadRequest(new { message = "Invalid Email or Password" });
            return Ok(new { token = token });
        }

        


        
        //For Testing purposes only
        [Authorize]
        [HttpGet]
        public IActionResult OnlyAuthenticated()
        {
            return Ok("You are Authenticated");
        }

        [Authorize(Roles ="Admin")]
        [HttpGet("Admin_Only")]
        public IActionResult OnlyAdmin()
        {
            return Ok(new { message = "You are an Admin"});
        }


    }
}