namespace WebTemplate.Controllers;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using BCrypt = BCrypt.Net.BCrypt;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{       
    public Context Context { get; set; }
     public AuthController(Context context)
     {
         Context = context;
     }
     [HttpPost("register/{username}/{password}/{tipUsera}")]
     public async Task<ActionResult> register(string username , string password , string tipUsera){
        try{
        if(tipUsera!= "Kupac" && tipUsera!="SezonskiRadnik")
            return BadRequest("user mora biti kupac ili radnik");
        if(string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            return BadRequest("Morate uneti username i password");
       User NoviUser = new User
        {
            UserName = username,
            Password = BCrypt.HashPassword(password),
            TipUsera = tipUsera,
            Zabrana = false
        };
        var Postoji = await Context.Useri.Where(p => p.UserName == NoviUser.UserName).FirstOrDefaultAsync();
        if(Postoji!= null){
            return BadRequest("Vec postoji korisnik sa tim korisnickim imenom");
        }
        await Context.Useri.AddAsync(NoviUser);
        await Context.SaveChangesAsync();
        return Ok(NoviUser);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
    [HttpPost("login/{username}/{password}")]
    public ActionResult login(string username, string password)
    {
        try
        {
            var user = Context.Useri.Where(p => p.UserName == username).FirstOrDefault();
            if (user == null)
            {
                return BadRequest("Nepostojeci user");
            }
            if (!BCrypt.Verify(password , user.Password))
                return BadRequest("Pogresna lozinka");

            string token = CreateToken(user);
            return Ok(token);

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
  private string CreateToken(User user)
{
    List<Claim> claims = new List<Claim> {
        new Claim(ClaimTypes.Name , user.UserName),
        new Claim(ClaimTypes.Role , user.TipUsera),
        new Claim("UserID" , user.ID.ToString())
    };
    var key = new byte[64];
    using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
    {
        rng.GetBytes(key);
    }

    var securityKey = new SymmetricSecurityKey(key);
    var creds = new SigningCredentials(securityKey , SecurityAlgorithms.HmacSha512);

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.Now.AddDays(1),
        signingCredentials: creds
    );

    var jwt = new JwtSecurityTokenHandler().WriteToken(token);
    return jwt;
}

}
