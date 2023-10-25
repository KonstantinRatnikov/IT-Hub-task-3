using Microsoft.AspNetCore.Mvc;
using WebApi.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using System.Data.SqlClient;
using System.Data;

namespace WebApi.Controllers.user
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRegistrationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public UserRegistrationController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }
        [HttpPost]
        public JsonResult Post(User user)
        {
            string hashedPassword = HashPasswordClass.HashPassword(user.Password);

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("NotesAppCon");

            using (SqlConnection connection = new SqlConnection(sqlDataSource))
            {
                connection.Open();

                string insertPasswordQuery = "INSERT INTO dbo.Users (username, password_hash ) VALUES (@username, @password_hash)";
                using (SqlCommand passwordCommand = new SqlCommand(insertPasswordQuery, connection))
                {
                    passwordCommand.Parameters.AddWithValue("@username", user.Username);
                    passwordCommand.Parameters.AddWithValue("@password_hash", hashedPassword);

                    passwordCommand.ExecuteNonQuery();
                }

                insertPasswordQuery = "INSERT INTO Notes (user_id, title, content) VALUES( (SELECT user_id FROM Users WHERE username = @username),'Заголовок заметки', 'Содержание заметки'); ";
                using (SqlCommand passwordCommand = new SqlCommand(insertPasswordQuery, connection))
                {
                    passwordCommand.Parameters.AddWithValue("@username", user.Username);

                    passwordCommand.ExecuteNonQuery();
                }
                connection.Close();
            }
            return new JsonResult("Added Successfully");
        }
    }
}
