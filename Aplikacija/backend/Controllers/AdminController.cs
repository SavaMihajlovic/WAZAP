using Models;

namespace Controllers;


[ApiController]
[Route("[controller]")]
public class AdminController : ControllerBase
{   
    public Context Context { get; set; }
    private readonly IConfiguration configuration;
     public AdminController(Context context , IConfiguration configuration)
     {
         Context = context;
         this.configuration = configuration;
     }
     [HttpPost("AddAdmin/{korisnikID}")]
     public async Task<ActionResult> AddAdmin(int korisnikID){
        try{
            var toBeAdmin = await Context.Korisnici.FindAsync(korisnikID); 
            if (toBeAdmin == null)
                return BadRequest("Korisnik nije nađen");
            if(toBeAdmin.TipKorisnika == "Kupac"){
                var roleBefore = await Context.Kupaci.Where(p => p.Korisnik.ID == korisnikID).FirstOrDefaultAsync();
                if(roleBefore != null){
                    Context.Kupaci.Remove(roleBefore);
                }
            }
            else{
                var roleBefore = await Context.Radnici.Where(p => p.Korisnik.ID == korisnikID).FirstOrDefaultAsync();
                if(roleBefore!= null)
                    Context.Radnici.Remove(roleBefore);
            }
            await Context.SaveChangesAsync();
            return Ok("Korisniku je dodata privilegija admina");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     [HttpPut("ProcessRequestSwimmer/{zahtevID}/{adminID}/{status}")]
     public async Task<ActionResult> ProcessRequestSwimmer(int zahtevID , int adminID , string status){
        try{
            if(status != "pending" && status != "readyForPayment" && status != "blocked" && status != "completed")
                return BadRequest("Status je nevalidan");
            var zahtev = await Context.ZahtevIzdavanje.FindAsync(zahtevID);
            if(zahtev == null)
                return BadRequest("Zahtev nije pronađen");
            var admin = await Context.Admini.FindAsync(adminID);
            if(admin == null)
                return BadRequest("Admin nije pronađen");
            zahtev.Admin = admin;
            zahtev.Status = status;
            if(status == "completed"){
                zahtev.DatumOd = DateTime.Today;
                DateTime datum = DateTime.Today;
                if(zahtev.Tip_Karte == "mesecna")
                    zahtev.DatumDo = datum.AddDays(30);
                else{
                    zahtev.DatumDo = datum.AddDays(15);
                }
            }
            await Context.SaveChangesAsync();
            return Ok("Zahtev je obrađen");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }

      [HttpPut("ProcessRequestWorker/{zahtevID}/{adminID}/{status}")]
     public async Task<ActionResult> ProcessRequestWorker(int zahtevID , int adminID , string status){
        try{
            if(status != "pending"  && status != "blocked" && status != "completed")
                return BadRequest("Status je nevalidan");
            var zahtev = await Context.ZahtevPosao.FindAsync(zahtevID);
            if(zahtev == null)
                return BadRequest("Zahtev nije pronađen");
            var admin = await Context.Admini.FindAsync(adminID);
            if(admin == null)
                return BadRequest("Admin nije pronađen");
            zahtev.Admin = admin;
            zahtev.Status = status;
            if(status == "completed")
                zahtev.DatumZaposlenja = DateTime.Today;
            await Context.SaveChangesAsync();
            return Ok("Zahtev je obrađen");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     
}