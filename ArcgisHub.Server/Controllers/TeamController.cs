using ArcgisHub.Server.models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using System.Data.SqlTypes;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ArcgisHub.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //api/Team/endpoint

    public class TeamController: Controller
    {
        private readonly IConfiguration _config;

        public TeamController(IConfiguration config)
        {
            _config = config;
        }

        [Authorize]
        [HttpGet("showSettings")]
        public IActionResult ShowSettings()
        {
            var userName = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var teamValue = Convert.ToInt32(User.FindFirst("team")?.Value);
            
            if(teamValue == 10)
            {
                var response = new {ShowSettings = true};
                return Ok(response);
            }
            else
            {
                var response = new{ShowSettings = false};
                return Ok(response);
            }
            
        }

        [Authorize]
        [HttpPost("JoinTeam")]
        public IActionResult JointTeam([FromBody] TeamModels team)
        {
            try
            {                
                var userName = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRol = User.FindFirst("rol")?.Value;
                var teamValue = User.FindFirst("team")?.Value;
                var teamValueInt = Convert.ToInt32(teamValue);
                

                if(teamValueInt != 10)
                {
                    var responseDeg = new {success = false, message = "el usuario ya pertenece a un equipo"};
                    return Ok(responseDeg);
                }
                
                using (MySqlConnection connection = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();
                    string queryString = "UPDATE users set idTeam = @idTeam Where username = @username";
                    using (MySqlCommand cmd = new MySqlCommand(queryString, connection))
                    {
                        cmd.Parameters.AddWithValue("@idTeam", team.idTeamToJoin);
                        cmd.Parameters.AddWithValue("@username", userName);
                        
                        cmd.ExecuteNonQuery();
                    }

                }
                var token = GenerateJwtToken(userName, userRol, Convert.ToString(team.idTeamToJoin));
                Response.Cookies.Append("tokenn", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(30)
                });
                
                var response = new {success = true, message = "Ya se unio al equipo", team = team.idTeamToJoin};
                return Ok(response);

            }
            catch (MySqlException ex)
            {
                var ResponseError = new {success = false, message= "ocurrio un error", ex = ex};
                Console.WriteLine(ex);
                return Ok(ResponseError);
            }
        }

        private string GenerateJwtToken(string username, string rol, string team)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            var claims = new[]
            {
                //new Claim(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim("rol", rol),
                new Claim("team", team),
                new Claim(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

            };

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            return new JwtSecurityTokenHandler().WriteToken(token);

        }

    }

    
}

