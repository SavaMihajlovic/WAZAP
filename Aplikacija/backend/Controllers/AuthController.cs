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
            korisnik.TokenForgotPassword = null;
            korisnik.ForgotPasswordExp = null;
            if(DateTime.Now.Year - korisnik.DatumRodjenja.Year < 18)
                return BadRequest("Neophodno je imati makar 18 godina");
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
            AddTypeOfUser(korisnik);
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
     [HttpPost("ForgotPassword/{email}")]
     public async Task<ActionResult> ForgotPassword(string email){
        try{
            var user = await Context.Korisnici.Where(p => p.Email == email).FirstOrDefaultAsync();
            if(user == null)
                return BadRequest("User sa ovim nalogom ne postoji");
            string link = $"{configuration.GetSection("AppSettings:FrontendURL").Value!}/reset-password";
            string fromMail = configuration.GetSection("AppSettings:FromMail").Value!;
            string fromPassword = configuration.GetSection("AppSettings:FromPassword").Value!;
            string toMail = email;

            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromMail);
            message.Subject = "Forgot Password";
            message.To.Add(new MailAddress(email));
            message.Body = $"<html><body> <a href='{link}'>Promenite vasu lozinku za WAZAP aplikaciju </a></body></html>";
            message.IsBodyHtml = true;

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail , fromPassword),
                EnableSsl = true,
            };
            smtpClient.Send(message);
            user.TokenForgotPassword = RandomString.GetString(Types.ALPHABET_MIXEDCASE , 8);
            user.ForgotPasswordExp = DateTime.Now.AddHours(1);
            await Context.SaveChangesAsync();
            return Ok("Poruka je poslata na vasu email adresu");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
      [HttpPost("ResetPassword/{email}")]
      public async Task<ActionResult> ResetPassword(string email){
         try{
             var user = await Context.Korisnici.Where(p => p.Email == email).FirstOrDefaultAsync();
             if (user == null)
                 return BadRequest("Korisnik sa ovim nalogom ne postoji");
             if(user.TokenForgotPassword == null || user.ForgotPasswordExp == null )
                 return BadRequest("Korisnik nema pristup stranici");
             if(user.TokenForgotPassword != null && user.ForgotPasswordExp < DateTime.Now)
                 return BadRequest("Nevalidan token , istekao je");
             return Ok(user.TokenForgotPassword);
         }
         catch(Exception ex){
             return BadRequest(ex.Message);
         }
      }
    [HttpPost("ChangePassword/{email}/{password}/{confirmPassword}")]
     public async Task<ActionResult> ChangePassword(string email , string password , string confirmPassword){
        try{
            if(password != confirmPassword)
                return BadRequest("Lozinke se ne poklapaju");
            var user = await Context.Korisnici.Where(p => p.Email == email).FirstOrDefaultAsync();
            if (user == null)
                return BadRequest("Korisnik sa ovim nalogom ne postoji");
            if(user.TokenForgotPassword == null || user.ForgotPasswordExp == null )
                return BadRequest("Korisnik nema pristup stranici");
            if(user.TokenForgotPassword != null && user.ForgotPasswordExp < DateTime.Now)
                return BadRequest("Nevalidan token , istekao je");
            user.TokenForgotPassword = null;
            user.ForgotPasswordExp = null;
            user.Lozinka = BCrypt.Net.BCrypt.HashPassword(password);
            await Context.SaveChangesAsync();
            return Ok("Lozinka je uspesno promenjena");
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
     private async void AddTypeOfUser(Korisnik korisnik){
         if(korisnik.TipKorisnika == "Kupac"){
            var Kupac = new Kupac {
                Korisnik = korisnik
            };
             await Context.Kupaci.AddAsync(Kupac);
         }
         else {
            var Radnik = new Radnik{
                Korisnik = korisnik
            };
            await Context.Radnici.AddAsync(Radnik);
         }
         await Context.SaveChangesAsync();
         return;
         
     }
}
