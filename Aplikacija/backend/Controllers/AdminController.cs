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
            var findAdmin = await Context.Admini.Include(p => p.Korisnik).Where(p => p.Korisnik.ID == adminID).Select(p => new{
                p.ID
            }).FirstOrDefaultAsync();
            var admin = await Context.Admini.FindAsync(findAdmin!.ID);
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

            else if(status == "blocked"){
                zahtev.DatumDo = DateTime.Today;
                var zahtevKupac = await Context.ZahtevIzdavanje.Include(p => p.Kupac).Where(p => p.ID == zahtevID).Select(p => new{
                    p.Kupac!.ID
                }).FirstOrDefaultAsync();
                var kupac = await Context.Kupaci.FindAsync(zahtevKupac!.ID);
                if(kupac == null)
                    return NotFound("Kupač nije nađen");
                kupac.Slika = null;
                kupac.Uverenje = null;
            }
            if(zahtev.Status == "blocked" || zahtev.Status == "readyForPayment"){
                 var zahtevKupac = await Context.ZahtevIzdavanje.Include(p => p.Kupac).Where(p => p.ID == zahtevID).Select(p => new{
                    p.Kupac!.ID
                }).FirstOrDefaultAsync();
                var kupac = await Context.Kupaci.FindAsync(zahtevKupac!.ID);
                if(kupac == null)
                    return NotFound("Kupač nije nađen");
                SendEmail(true , kupac.ID);
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
           var findAdmin = await Context.Admini.Include(p => p.Korisnik).Where(p => p.Korisnik.ID == adminID).Select(p => new{
                p.ID
            }).FirstOrDefaultAsync();
            var admin = await Context.Admini.FindAsync(findAdmin!.ID);
            if(admin == null)
                return BadRequest("Admin nije pronađen");
            if(admin == null)
                return BadRequest("Admin nije pronađen");
            zahtev.Admin = admin;
            zahtev.Status = status;
            if(status == "completed")
                zahtev.DatumZaposlenja = DateTime.Today;
            else if(status == "blocked"){
                var zahtevRadnik = await Context.ZahtevPosao.Include(p => p.Radnik).Where(p => p.ID == zahtevID).Select(p => new{
                    p.Radnik!.ID
                }).FirstOrDefaultAsync();
                var radnik = await Context.Radnici.FindAsync(zahtevRadnik!.ID);
                if(radnik == null)
                    return NotFound("Radnik nije nađen");
                radnik.Slika = null;
                radnik.Sertifikat = null;
            }
            if(zahtev.Status == "blocked" || zahtev.Status == "completed"){
                 var zahtevRadnik = await Context.ZahtevPosao.Include(p => p.Radnik).Where(p => p.ID == zahtevID).Select(p => new{
                    p.Radnik!.ID
                }).FirstOrDefaultAsync();
                if(zahtevRadnik == null)
                    return BadRequest("null je");
                var radnik = await Context.Radnici.FindAsync(zahtevRadnik.ID);
                if(radnik == null)
                    return NotFound("Radnik nije nađen1");
                SendEmail(false , radnik.ID);
            }
            await Context.SaveChangesAsync();
            return Ok("Zahtev je pronađen");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     async void SendEmail(bool typeSwimmer , int ID){
        try{
            string email;
            if(typeSwimmer){
                var swimmer = await Context.Kupaci.FindAsync(ID);
                if(swimmer == null)
                    throw new Exception("Kupač nije nađen");
                var user = await Context.Kupaci.Include(p => p.Korisnik).Where(p => p.ID == ID).Select(p => new{p.Korisnik.Email}).FirstOrDefaultAsync();
                if(user == null)
                    throw new Exception("Korisnik nije nađen");
                email = user.Email;
            }
            else{
                var worker = await Context.Radnici.FindAsync(ID);
                if(worker == null)
                    throw new Exception("Kupač nije nađen");
                var user = await Context.Radnici.Include(p => p.Korisnik).Where(p => p.ID == ID).Select(p => new{p.Korisnik.Email}).FirstOrDefaultAsync();
                if(user == null)
                    throw new Exception("Korisnik nije nađen");
                email = user.Email;
            }
            string fromMail = configuration.GetSection("AppSettings:FromMail").Value!;
            string fromPassword = configuration.GetSection("AppSettings:FromPassword").Value!;
            string toMail = email;

            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromMail);
            message.Subject = "Obrada zahteva";
            message.To.Add(new MailAddress(email));
            message.Body = $"<html><body> <p> Vaš zahtev je obrađen! Proverite stranicu za slanje zahteva! </p></body></html>";
            message.IsBodyHtml = true;

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail , fromPassword),
                EnableSsl = true,   
            };
            await smtpClient.SendMailAsync(message);
        }
        catch(Exception ex)
        {
            throw new Exception(ex.Message);
        }
     }
     
}