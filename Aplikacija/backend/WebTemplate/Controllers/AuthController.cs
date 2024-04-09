namespace WebTemplate.Controllers;
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
            TipUsera = tipUsera
        };
        await Context.SaveChangesAsync();
        return Ok(NoviUser);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
    
}
