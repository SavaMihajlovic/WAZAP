namespace WebTemplate.Controllers;
using BCrypt = BCrypt.Net.BCrypt;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{       
    public Context Context { get; set; }
     public UserController(Context context)
     {
         Context = context;
     }
     [HttpPost("DodajAdmina/{ime}/{lozinka}/{adminID}")]
     public async Task<ActionResult> DodajAdmina(string ime , string lozinka , int adminID){
        try{
            var admin = await Context.Useri.Where(p => p.ID == adminID).FirstOrDefaultAsync();
            if(admin == null){
                return BadRequest("Nepostojeci admin");
            }
            if(admin.TipUsera != "Admin"){
                return BadRequest("Neovlascen korisnik");
            }
            var user = new User {
                UserName = ime,
                Password = BCrypt.HashPassword(lozinka),
                TipUsera = "Admin"
            };
            await Context.Useri.AddAsync(user);
            await Context.SaveChangesAsync();
            return Ok(user);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     [HttpPost("DodeliZabranu/{ime}/{adminID}")]
     public async Task<ActionResult> DodeliZabranu(string ime , int adminID){
        var admin = await Context.Useri.Where(p => p.ID == adminID).FirstOrDefaultAsync();
            if(admin == null){
                return BadRequest("Nepostojeci admin");
            }
            if(admin.TipUsera != "Admin"){
                return BadRequest("Neovlascen korisnik");
            }
        var user = await Context.Useri.Where(p=> p.UserName == ime).FirstOrDefaultAsync();
        if(user == null){
            return BadRequest("Korisnik ne postoji");
        }
        if(user.TipUsera == "Admin"){
            return BadRequest("Nemoguce je dodeliti zabranu adminu");
        }
        user.Zabrana = true;
        await Context.SaveChangesAsync();
        return Ok($"Dodeljena je zabrana korisniku : {ime}");
     }
     [HttpDelete("ObrisiNalogKorisnika/{ime}/{adminID}")]
     public async Task<ActionResult> ObrisiNalogKorisnika(string ime , int adminID){
         var admin = await Context.Useri.Where(p => p.ID == adminID).FirstOrDefaultAsync();
            if(admin == null){
                return BadRequest("Nepostojeci admin");
            }
            if(admin.TipUsera != "Admin"){
                return BadRequest("Neovlascen korisnik");
            }
        var user = await Context.Useri.Where(p=> p.UserName == ime).FirstOrDefaultAsync();
        if(user == null){
            return BadRequest("Korisnik ne postoji");
        }
        if(user.TipUsera == "Admin"){
            return BadRequest("Nemoguce je obrisati nalog admina");
        }

        Context.Useri.Remove(user);
        await Context.SaveChangesAsync();
        return Ok($"Obrisan je korisnik : {ime}");
     }
     [HttpGet("PrikaziKupace")]
     public async Task<ActionResult> PrikaziKupace(){
        try{
        var kupaci = await Context.Useri.Where(p => p.TipUsera == "Kupac").Select(p => new {
            p.ID,
            p.UserName,
            p.Slika,
            p.Zabrana
        }).ToListAsync();
        return Ok(kupaci);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     [HttpGet("PrikaziSezonskeRadnike")]
      public async Task<ActionResult> PrikaziSezonskeRadnike(){
        try{
        var radnici = await Context.Useri.Where(p => p.TipUsera == "SezonskiRadnik").Select(p => new {
            p.ID,
            p.UserName,
            p.Sertifikat,
            p.Zabrana
        }).ToListAsync();
        return Ok(radnici);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }

    

}
