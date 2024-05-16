using Models;

namespace Controllers;


[ApiController]
[Route("[controller]")]
public class LezaljkaController : ControllerBase
{   
    public Context Context { get; set; }
    private readonly IConfiguration configuration;
     public LezaljkaController(Context context , IConfiguration configuration)
     {
         Context = context;
         this.configuration = configuration;
     }
     [HttpPost("AddLezaljka")]
     public async Task<ActionResult> AddLezaljka([FromBody] Lezaljka lezaljka){
        try{
            await Context.Lezaljke.AddAsync(lezaljka);
            await Context.SaveChangesAsync();
            return Ok($"Lezaljka {lezaljka.ID} je dodata u bazu");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     [HttpGet("GetAllLezaljke")]
     public async Task<ActionResult> GetAllLezaljke(){
        try{
            var sveLezaljke = await Context.Lezaljke.ToListAsync();
            return Ok(sveLezaljke);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     [HttpGet("GetAllTaken/{datum}")]
     public async Task<ActionResult> GetAllTaken(DateTime datum){
        try{
            var taken = await Context.Rezervacije.Where(p => p.Datum.Date == datum.Date).Select(p => new{
                p.Lezaljka!.ID,
                p.Lezaljka.Cena
            }).ToListAsync();
            return Ok(taken);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     [HttpGet("GetAllFree/{datum}")]
    public async Task<ActionResult> GetAllFree(DateTime datum){
        try{
            var rezervacijeZaDatum = await Context.Rezervacije.Where(r => r.Datum.Date == datum.Date).Select(r => r.Lezaljka!.ID).ToListAsync();
            var slobodneLezaljke = await Context.Lezaljke
                .Where(l => !rezervacijeZaDatum.Contains(l.ID))
                .Select(l => new {
                    l.ID,
                    l.Cena
                })
                .ToListAsync();

            return Ok(slobodneLezaljke);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
    }
    [HttpPut("ChangeAmount/{easyChairID}/{amount}")]
    public async Task<ActionResult> ChangeAmount(int easyChairID , double amount){
        try{
            var easyChair = await Context.Lezaljke.FindAsync(easyChairID);
            if(easyChair == null)
                return BadRequest($"Ležaljka {easyChairID} nije nađena");
            easyChair.Cena = amount;
            await Context.SaveChangesAsync();
            return Ok($"Promenjena cena ležaljke :{easyChairID} na {amount} EUR");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
    }

}