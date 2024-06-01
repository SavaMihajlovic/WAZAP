using Models;

namespace Controllers;


[ApiController]
[Route("[controller]")]
public class ZahtevIzdavanjeController : ControllerBase
{   
    public Context Context { get; set; }
    private readonly IConfiguration configuration;
    private readonly IWebHostEnvironment environment;
     public ZahtevIzdavanjeController(Context context , IConfiguration configuration , IWebHostEnvironment environment)
     {
         Context = context;
         this.configuration = configuration;
         this.environment = environment;
     }
     [HttpPost("AddRequest/{userId}/{typeOfCard}")]
     public async Task<ActionResult> AddRequest(int userId , string typeOfCard ,  IFormFile slika ,  IFormFile? uverenje){
        try{
            if(slika == null || slika.Length == 0)
                return BadRequest("Slika je obavezna");
            if(typeOfCard!= "mesecna" && typeOfCard!="polumesecna")
                return BadRequest("Tip karte mora biti mesečna ili polumesećna");
            var user = await Context.Korisnici.FindAsync(userId);
            if(user == null)
                return BadRequest("Korisnik nije pronađen");
            var swimmer = await Context.Kupaci.Where(p => p.Korisnik.ID == userId).FirstOrDefaultAsync();
            if(swimmer == null)
                return BadRequest("Korisnik nije kupač");
            string uploadsFolder = Path.Combine(environment.WebRootPath , "Images");
            if(!Directory.Exists(uploadsFolder)){
                Directory.CreateDirectory(uploadsFolder);
            }
            string slikaFileName = $"{userId}_slika.png";
            string slikaFilePath = Path.Combine(uploadsFolder,slikaFileName);
            using(var stream = new FileStream(slikaFilePath , FileMode.Create)){
                await slika.CopyToAsync(stream);
            }
            string? uverenjeFileName = null;
            uverenjeFileName = $"{userId}_uverenje.png";
            string uverenjeFilePath = Path.Combine(uploadsFolder, uverenjeFileName);
            if (System.IO.File.Exists(uverenjeFilePath))
            {
                    System.IO.File.Delete(uverenjeFilePath);
            }

            if(uverenje != null && uverenje.Length > 0){
                using (var stream = new FileStream(uverenjeFilePath, FileMode.Create))
                {
                    await uverenje.CopyToAsync(stream);
                }
                
            }
            swimmer.Slika = slikaFileName;
            swimmer.Uverenje = uverenjeFileName;
            await Context.SaveChangesAsync();
            var zahtevIzdavanje = new ZahtevIzdavanje {
                Tip_Karte = typeOfCard,
                Status = "pending",
                Kupac = swimmer,
                DatumOd = DateTime.Today
            };
            await Context.ZahtevIzdavanje.AddAsync(zahtevIzdavanje);
            await Context.SaveChangesAsync();
            return Ok("Zahtev je uspešno poslat");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     [HttpGet("GetAll")]
     public async Task<ActionResult> GetAll(){
        try{
            var zahtevIzdavanje = await Context.ZahtevIzdavanje.Include(p => p.Admin).Include(p => p.Kupac).ToListAsync();
            return Ok(zahtevIzdavanje);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
     }
    [HttpGet("GetAllStatus/{status}")]
     public async Task<ActionResult> GetAllStatus(string status){
        try{
            if(status != "pending" && status != "readyForPayment" && status != "completed" && status != "blocked"){}
            var zahtevIzdavanje = await Context.ZahtevIzdavanje.Where(p => p.Status == status).ToListAsync();
            return Ok(zahtevIzdavanje);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
     }
     [HttpGet("GetDetails/{zahtevID}/{kupacID}")]
     public async Task<ActionResult> GetDetails(int zahtevID , int kupacID){
        try{
            var zahtevIzdavanje = await Context.ZahtevIzdavanje.Where(p => p.ID == zahtevID && p.Kupac!.ID == kupacID).FirstOrDefaultAsync();
            if(zahtevIzdavanje == null) 
                return BadRequest("Zahtev nije pronađen");
            var kupac = await Context.Kupaci.FindAsync(kupacID);
            if(kupac == null)
                return BadRequest("Kupac nije nađen");
            return Ok(kupac);
            
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
     }
   [HttpGet("GetImage/{userId}")]
    public async Task<IActionResult> GetImage(int userId)
    {
        try
        {
            var swimmer = await Context.Kupaci.Include(p => p.Korisnik).Where(p => p.ID == userId).Select(p => new{
                p.Korisnik.ID
            } ).FirstOrDefaultAsync();
            if (swimmer == null)
                return NotFound("Kupac nije pronađen");
            string uploadsFolder = Path.Combine(environment.WebRootPath, "Images");
            string slikaFileName = $"{swimmer.ID}_slika.png";
            string slikaFilePath = Path.Combine(uploadsFolder, slikaFileName);

            if (!System.IO.File.Exists(slikaFilePath))
                return NotFound("Slika nije pronađena");

            var fileStream = new FileStream(slikaFilePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "image/png"); 
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetImageUverenje/{userId}")]
    public async Task<IActionResult> GetImageUverenje(int userId)
    {
        try
        {
             var swimmer = await Context.Kupaci.Include(p => p.Korisnik).Where(p => p.ID == userId).Select(p => new{
                p.Korisnik.ID
            } ).FirstOrDefaultAsync();
            if (swimmer == null)
                return NotFound("Kupač nije pronađen");
            string uploadsFolder = Path.Combine(environment.WebRootPath, "Images");
            string uverenjeFileName = $"{swimmer.ID}_uverenje.png";
            string uverenjeFilePath = Path.Combine(uploadsFolder, uverenjeFileName);
            
            if (!System.IO.File.Exists(uverenjeFilePath))
                return Ok("Slika nije nađena");

            var fileStream = new FileStream(uverenjeFilePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "image/png"); 
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("GetMyRequest/{userID}")]
    public async Task<ActionResult> GetMyRequest(int userID){
        try{
            var swimmer = await Context.Kupaci.Include(p => p.Korisnik).Where(p => p.Korisnik.ID == userID).Select(p => new
            {
            p.ID
            }).FirstOrDefaultAsync();
            if(swimmer == null)
            {
                return NotFound("Korisnik nije kupač");
            }
            var odobrenZahtev= await Context.ZahtevIzdavanje.Include(p => p.Kupac).Where(p => p.DatumDo > DateTime.Now && p.Status == "completed" && p.Kupac!.ID == swimmer.ID).Select(p => new{
            p.Status,
            p.DatumOd,
            p.DatumDo
            }).FirstOrDefaultAsync();
            if(odobrenZahtev == null)
            {
                var placanjeIzdavanja = await Context.ZahtevIzdavanje.Include(p => p.Kupac).Where(p => p.Status == "readyForPayment" && p.Kupac!.ID == swimmer.ID).Select(p => new{
                p.Status,
                p.ID,
                p.Tip_Karte,
                p.Kupac!.Uverenje
                }).FirstOrDefaultAsync();

                if(placanjeIzdavanja != null)
                    return Ok(placanjeIzdavanja);
                else {
                     var cekanjeZahteva = await Context.ZahtevIzdavanje.Include(p => p.Kupac).Where(p => p.Status == "pending" && p.Kupac!.ID == swimmer.ID).Select(p => new{
                     p.Status
                     }).FirstOrDefaultAsync();

                     if(cekanjeZahteva != null)
                        return Ok(cekanjeZahteva);
                     else
                        return Ok("Nema poslatih zahteva");
                }
            }
            else{
                return Ok(odobrenZahtev);
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("CompletedPurchase/{zahtevID}")]

    public async Task<ActionResult> CompletedPurchase(int zahtevID){
        try{
            var kompletiranZahtev = await Context.ZahtevIzdavanje.FindAsync(zahtevID);
            if(kompletiranZahtev == null)
                return BadRequest("Zahtev nije nađen");
            DateTime datum = DateTime.Today;
            kompletiranZahtev.DatumOd = datum;
            if(kompletiranZahtev.Tip_Karte == "mesecna")
                kompletiranZahtev.DatumDo = datum.AddDays(30);
            else
                kompletiranZahtev.DatumDo = datum.AddDays(15);
            kompletiranZahtev.Status = "completed";
            await Context.SaveChangesAsync();
            return Ok("Zahtev je kompletiran");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
    }

   

}