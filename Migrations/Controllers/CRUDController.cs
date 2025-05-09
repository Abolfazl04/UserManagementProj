using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserManagementProj.Models;

namespace UserManagementProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CRUDController : ControllerBase
    {
        private readonly UserDbContext _context;
        public CRUDController(UserDbContext context)
        {
            _context = context;
        }

        //Getting all the Users data R
        [Authorize(Roles = "Admin")]
        [HttpGet("GetAll")]
        public ActionResult GetAll()
        {
            var result = _context.Users.ToList();
            return new JsonResult(Ok(result));
        }

        //Editting the User data U
        [Authorize(Roles = "Admin")]
        [HttpPut("Edit/{id}")]
        public async Task<IActionResult> UpdateUser(
             string id,
             [FromBody] UserUpdateDto dto)

        {
            try
            {
                // Check input
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        Message = "Invalid input",
                        Errors = ModelState.Values.SelectMany(v => v.Errors)
                    });
                }

                // Find user
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found" });
                }

                // Update Info
                user.Email = dto.Email;
                user.UserName = dto.UserName;
                user.Role = dto.Role;
                user.EmailConfirmed = dto.EmailConfirmed;

                // Save 
                await _context.SaveChangesAsync();

                //Return updated user 
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred",
                    Error = ex.Message 
                });
            }
        }

        //Deleting Users D
        [Authorize(Roles = "Admin")]
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)

        {
            var user = await _context.Users.FindAsync(id);
            if (user is null)
                return NotFound(new { message = "ID not found" });

            else
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return Ok();
            }
        }
    }
}
