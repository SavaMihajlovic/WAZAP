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
            sertifikatFileName = $"{userId}_sertifikat.png";
            string sertifikatFilePath = Path.Combine(uploadsFolder, sertifikatFileName);
            if (System.IO.File.Exists(sertifikatFilePath))
            {
                    System.IO.File.Delete(sertifikatFilePath);
            }
            if (sertifikat != null && sertifikat.Length > 0)
            {
                using (var stream = new FileStream(sertifikatFilePath, FileMode.Create))
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
            .Include(p => p.Radnik).ThenInclude(p => p!.Korisnik)
            .Select(p => new 
            {
                p.ID,
                p.Tip_Posla,
                p.Status,
                p.Opis,
                radnikID = p.Radnik!.ID,
                p.Radnik.Korisnik.Ime,
                p.Radnik.Korisnik.Prezime,
                adminID = (int?)p.Admin!.ID,
                
            }).ToListAsync();
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
            var zahtevPosao = await Context.ZahtevPosao.Include(p => p.Radnik).ThenInclude(p => p!.Korisnik).Where(p => p.Status == status).Select(p => new
            {
                p.ID,
                p.Tip_Posla,
                p.Status,
                p.Opis,
                radnikID = p.Radnik!.ID,
                p.Radnik.Korisnik.Ime,
                p.Radnik.Korisnik.Prezime,
                adminID = (int?)p.Admin!.ID,
            }).ToListAsync();
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
                return Ok("Kupač nije pronađen");
            string uploadsFolder = Path.Combine(environment.WebRootPath, "Images");
            string uverenjeFileName = $"{worker.ID}_sertifikat.png";
            string uverenjeFilePath = Path.Combine(uploadsFolder, uverenjeFileName);
            
            if (!System.IO.File.Exists(uverenjeFilePath))
                return Ok("Korisnik nema sertifikat");

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
            var radnik = await Context.Radnici.Include(p => p.Korisnik).Where(p => p.Korisnik.ID == userID).Select(p => new
            {
            p.ID
            }).FirstOrDefaultAsync();
            if(radnik == null)
            {
                return NotFound("Korisnik nije kupač");
            }
            var odobrenZahtev= await Context.ZahtevPosao.Include(p => p.Radnik).Where(p =>  p.Status == "completed" && p.Radnik!.ID == radnik.ID).Select(p => new{
            p.Status
            }).FirstOrDefaultAsync();
            if(odobrenZahtev == null)
            {
                     var cekanjeZahteva = await Context.ZahtevPosao.Include(p => p.Radnik).Where(p => p.Status == "pending" && p.Radnik!.ID == radnik.ID).Select(p => new{
                     p.Status
                     }).FirstOrDefaultAsync();

                     if(cekanjeZahteva != null)
                        return Ok(cekanjeZahteva);
                     else
                        return Ok("Nema poslatih zahteva");
                
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
}