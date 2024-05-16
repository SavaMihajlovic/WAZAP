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
     
}