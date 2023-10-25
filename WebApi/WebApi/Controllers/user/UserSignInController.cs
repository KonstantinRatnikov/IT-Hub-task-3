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
    public class UserSignInController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public UserSignInController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }

        [HttpPost]
        public IActionResult POST(User user)
        {
            string hashedPassword = HashPasswordClass.HashPassword(user.Password);
            string query = @"select username, password_hash
                    from dbo.Users 
                    where username = '" + user.Username + @"' and password_hash = '" + hashedPassword + @"'";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("NotesAppCon");
            SqlDataReader myReader;
            bool isLoginSuccessful = false;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader); ;
                    if (table.Rows.Count == 1)
                    {
                        isLoginSuccessful = true;
                    }
                    myReader.Close();
                    myCon.Close();
                }
            }

            if (isLoginSuccessful)
            {
                var tokenString = Token.GenerateToken(user.Username);
                return new JsonResult(new { Token = tokenString });
            }
            else
            {
                return new JsonResult("Неверный ID или пароль");
            }
        }
    }
}
