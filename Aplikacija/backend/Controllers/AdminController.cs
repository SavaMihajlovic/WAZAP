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
     [HttpPost("AddAdmin")]
     public async Task<ActionResult> AddAdmin([FromBody] Korisnik korisnik){
        try{
            var toBeAdmin = await Context.Korisnici.FindAsync(korisnik.ID); 
            if (toBeAdmin == null)
                return BadRequest("Korisnik nije nadjen");
            if(korisnik.TipKorisnika == "Kupac"){
                var roleBefore = await Context.Kupaci.Where(p => p.Korisnik.ID == korisnik.ID).FirstOrDefaultAsync();
                if(roleBefore != null){
                    Context.Kupaci.Remove(roleBefore);
                }
            }
            else{
                var roleBefore = await Context.Radnici.Where(p => p.Korisnik.ID == korisnik.ID).FirstOrDefaultAsync();
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