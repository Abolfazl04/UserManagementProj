using UserManagementProj.Models;

namespace UserManagementProj.Services
{
    public interface IAuthService
    {
        Task<UserDTO?> RegisterAsync(UserDTO Requst);
        Task<string?> LoginAsync(UserDTO Requset);
    }
}
