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
            if(uverenje != null && uverenje.Length > 0){
                uverenjeFileName = $"{userId}_uverenje.png";
                string uverenjeFilePath = Path.Combine(uploadsFolder, uverenjeFileName);
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
                Kupac = swimmer
            };
            await Context.ZahtevIzdavanje.AddAsync(zahtevIzdavanje);
            await Context.SaveChangesAsync();
            return Ok("Zahtev je uspešno poslat");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
}