
using System.Text;
using Models;

namespace Controllers;


[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{   
    public Context Context { get; set; }
    private readonly IConfiguration configuration;
     public AuthController(Context context , IConfiguration configuration)
     {
         Context = context;
         this.configuration = configuration;
     }

     [HttpPost("Register")]
     public async Task<ActionResult> Register([FromBody] Korisnik korisnik){
        try{
            if(korisnik.TipKorisnika != "Kupac" && korisnik.TipKorisnika != "Radnik")
                return BadRequest("Nevalidan tip korisnika");
            if(korisnik.Lozinka.Length < 8)
                return BadRequest("Lozinka mora imati minimalno 8 karaktera");
            if (!Regex.IsMatch(korisnik.Lozinka, @"\d"))
                return BadRequest("Lozinka mora sadrzati makar jednu cifru");
              if (!korisnik.Email.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Email adresa mora biti Gmail adresa.");
            korisnik.Lozinka = BCrypt.Net.BCrypt.HashPassword(korisnik.Lozinka);

            await Context.Korisnici.AddAsync(korisnik);
            await Context.SaveChangesAsync();
            return Ok($"Korisnik {korisnik.Ime} {korisnik.Prezime} je uspesno registrovan");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     [HttpPost("Login/{korisnickoIme}/{lozinka}")]
     public async Task<ActionResult> Login(string korisnickoIme , string lozinka){
        try{
            var user = await Context.Korisnici.Where(p => p.KorisnickoIme == korisnickoIme).FirstOrDefaultAsync();
            if(user == null){
                return BadRequest("Korisnicko ime nije pronadjeno");
            }
            if(!BCrypt.Net.BCrypt.Verify(lozinka , user.Lozinka)){
                return BadRequest("Pogresna lozinka");
            }
            string token = CreateToken(user);
            return Ok(token);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     
     private string CreateToken(Korisnik korisnik){
        List<Claim> claims = new List<Claim>(){
            new Claim("Name", korisnik.KorisnickoIme),
            new Claim("Type", korisnik.TipKorisnika),
            new Claim("Email",korisnik.Email),
            new Claim("KorisnikID" , korisnik.ID.ToString())
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings:Token").Value!));
        var cred = new SigningCredentials(key , SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            claims: claims,
            expires : DateTime.Now.AddHours(1),
            signingCredentials : cred
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return jwt;
    }
}
