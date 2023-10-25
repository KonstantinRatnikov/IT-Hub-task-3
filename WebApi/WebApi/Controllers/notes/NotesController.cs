using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using WebApi.Models;
using Microsoft.AspNetCore.Hosting;
using System;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public NotesController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }

        [HttpGet]
        public IActionResult Get()
        {
            // Получение токена из заголовка запроса
            string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (!Token.CheckToken(token))
            {
                return new JsonResult("Токен неверный");
            }

            string user = Token.GetUserClaim(token);

            string query = "Select * from Notes where user_id =(SELECT user_id FROM Users WHERE username = '" + user + @"') ;";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("NotesAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader); ;

                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }
        [HttpPost]
        public JsonResult Post(Note notes)
        {
            // Получение токена из заголовка запроса
            string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (!Token.CheckToken(token))
            {
                return new JsonResult("Токен неверный");
            }

            string user = Token.GetUserClaim(token);

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("NotesAppCon");
            SqlDataReader myReader;

            using (SqlConnection connection = new SqlConnection(sqlDataSource))
            {
                connection.Open();

                string insertQuery = "INSERT INTO Notes (user_id, title, content) VALUES( (SELECT user_id FROM Users WHERE username = @username),@titleNote, @contentNote); ";
                using (SqlCommand Command = new SqlCommand(insertQuery, connection))
                {
                    Command.Parameters.AddWithValue("@username", user);
                    Command.Parameters.AddWithValue("@titleNote", notes.Title);
                    Command.Parameters.AddWithValue("@contentNote", notes.Content);

                    Command.ExecuteNonQuery();
                }
                connection.Close();
            }
            return new JsonResult("Added Successfully");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            // Получение токена из заголовка запроса
            string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (!Token.CheckToken(token))
            {
                return new JsonResult("Токен неверный");
            }

            string user = Token.GetUserClaim(token);

            string sqlDataSource = _configuration.GetConnectionString("NotesAppCon");

            using (SqlConnection connection = new SqlConnection(sqlDataSource))
            {
                connection.Open();

               
                string deletePasswordQuery = "DELETE FROM Notes WHERE note_id = @note_id";
                using (SqlCommand passwordCommand = new SqlCommand(deletePasswordQuery, connection))
                {
                    passwordCommand.Parameters.AddWithValue("@note_id", id);

                    // Выполнение команды удаления пароля
                    passwordCommand.ExecuteNonQuery();
                }
                connection.Close();
            }

            return new JsonResult("Deleted Successfully");
        }

        [HttpPut]
        public JsonResult Put(Note notes)
        {
            // Получение токена из заголовка запроса
            string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (!Token.CheckToken(token))
            {
                return new JsonResult("Токен неверный");
            }

            string user = Token.GetUserClaim(token);

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("NotesAppCon");
            SqlDataReader myReader;

            using (SqlConnection connection = new SqlConnection(sqlDataSource))
            {
                connection.Open();

                string updateQuery = "UPDATE Notes SET title = @titleNote, content = @contentNote, timestamp = GETDATE() WHERE note_id = @note_id ";
                using (SqlCommand Command = new SqlCommand(updateQuery, connection))
                {
                    Command.Parameters.AddWithValue("@note_id", notes.NoteId);
                    Command.Parameters.AddWithValue("@titleNote", notes.Title);
                    Command.Parameters.AddWithValue("@contentNote", notes.Content);

                    Command.ExecuteNonQuery();
                }
                connection.Close();
            }
            return new JsonResult("Added Successfully");
        }
    }
}
