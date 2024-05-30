using Models;

namespace Controllers;


[ApiController]
[Route("[controller]")]
public class ZahtevPosaoController : ControllerBase
{   
    public Context Context { get; set; }
    private readonly IConfiguration configuration;
    private readonly IWebHostEnvironment environment;
     public ZahtevPosaoController(Context context , IConfiguration configuration , IWebHostEnvironment environment)
     {
         Context = context;
         this.configuration = configuration;
         this.environment = environment;
     }
     [HttpPost("AddRequest/{userId}/{typeOfJob}")]
public async Task<ActionResult> AddRequest(int userId, string typeOfJob, string? opis, IFormFile slika, IFormFile? sertifikat)
{
    try
    {
        if (slika == null || slika.Length == 0)
            return BadRequest("Slika je obavezna");
        
        if (typeOfJob != "Spasilac" && typeOfJob != "Čistač bazena" && typeOfJob != "Prodavac karata")
            return BadRequest("Tip posla nije odgovarajući");

        var user = await Context.Korisnici.FindAsync(userId);
        if (user == null)
            return BadRequest("Korisnik nije pronađen");

        var worker = await Context.Radnici.Where(p => p.Korisnik.ID == userId).FirstOrDefaultAsync();
        if (worker == null)
            return BadRequest("Korisnik nije radnik");

        string uploadsFolder = Path.Combine(environment.WebRootPath, "Images");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        string slikaFileName = $"{userId}_slika.png";
        string slikaFilePath = Path.Combine(uploadsFolder, slikaFileName);
        using (var stream = new FileStream(slikaFilePath, FileMode.Create))
        {
            await slika.CopyToAsync(stream);
        }

        string? sertifikatFileName = null;
        if (sertifikat != null && sertifikat.Length > 0)
        {
            sertifikatFileName = $"{userId}_sertifikat.png";
            string uverenjeFilePath = Path.Combine(uploadsFolder, sertifikatFileName);
            using (var stream = new FileStream(uverenjeFilePath, FileMode.Create))
            {
                await sertifikat.CopyToAsync(stream);
            }
        }

        worker.Slika = slikaFileName;
        worker.Sertifikat = sertifikatFileName;
        await Context.SaveChangesAsync();

        ZahtevPosao zahtevPosao = new ZahtevPosao
        {
            Tip_Posla = typeOfJob,
            Status = "pending",
            Radnik = worker,
            Opis = opis
        };

        await Context.ZahtevPosao.AddAsync(zahtevPosao);
        await Context.SaveChangesAsync();

        return Ok("Zahtev je uspešno poslat");
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
    }
     [HttpGet("GetAll")]
     public async Task<ActionResult> GetAll(){
        try{
            var zahtevPosao = await Context.ZahtevPosao
            .Include(p => p.Radnik)
            .Include(p => p.Admin).ToListAsync();
            return Ok(zahtevPosao);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
     }
    [HttpGet("GetAllStatus/{status}")]
     public async Task<ActionResult> GetAllStatus(string status){
        try{
            if(status != "pending" && status != "completed" && status != "blocked"){}
            var zahtevPosao = await Context.ZahtevPosao.Where(p => p.Status == status).ToListAsync();
            return Ok(zahtevPosao);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
     }
     [HttpGet("GetDetails/{zahtevID}/{radnikID}")]
     public async Task<ActionResult> GetDetails(int zahtevID , int radnikID){
        try{
            var ZahtevPosao = await Context.ZahtevPosao.Where(p => p.ID == zahtevID && p.Radnik!.ID == radnikID).FirstOrDefaultAsync();
            if(ZahtevPosao == null) 
                return BadRequest("Zahtev nije pronađen");
            var radnik = await Context.Radnici.FindAsync(radnikID);
            if(radnik == null)
                return BadRequest("Kupac nije nađen");
            return Ok(radnik);
            
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
            var worker = await Context.Radnici.Include(p => p.Korisnik).Where(p => p.ID == userId).Select(p => new{
                p.Korisnik.ID
            } ).FirstOrDefaultAsync();
            if (worker == null)
                return NotFound("Radnik nije pronađen");
            

            string uploadsFolder = Path.Combine(environment.WebRootPath, "Images");
            string slikaFileName = $"{worker.ID}_slika.png";
            string slikaFilePath = Path.Combine(uploadsFolder, slikaFileName);
            
            if (!System.IO.File.Exists(slikaFilePath))
                return NotFound("Slika nije pronađena");

            var fileStream = new FileStream(slikaFilePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "image/png"); // Vraća sliku kao odgovor
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetImageSertifikat/{userId}")]
    public async Task<IActionResult> GetImageSertifikat(int userId)
    {
        try
        {
             var worker = await Context.Radnici.Include(p => p.Korisnik).Where(p => p.ID == userId).Select(p => new{
                p.Korisnik.ID
            } ).FirstOrDefaultAsync();
            if (worker == null)
                return NotFound("Kupač nije pronađen");
            string uploadsFolder = Path.Combine(environment.WebRootPath, "Images");
            string uverenjeFileName = $"{worker.ID}_sertifikat.png";
            string uverenjeFilePath = Path.Combine(uploadsFolder, uverenjeFileName);
            
            if (!System.IO.File.Exists(uverenjeFilePath))
                return NotFound("Slika nije pronađena");

            var fileStream = new FileStream(uverenjeFilePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "image/png"); 
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


}