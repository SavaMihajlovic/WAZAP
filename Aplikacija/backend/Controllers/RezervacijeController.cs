using Models;

namespace Controllers;


[ApiController]
[Route("[controller]")]
public class RezervacijeController : ControllerBase
{   
    public Context Context { get; set; }
    private readonly IConfiguration configuration;

    public int maxNumberOfReservations {get; set;}
    public int DaysInAdvance { get; set; }
     public RezervacijeController(Context context , IConfiguration configuration)
     {
         Context = context;
         this.configuration = configuration;
         DaysInAdvance = 3;
         maxNumberOfReservations = 3;
     }

    [HttpPost("CheckReservation/{userID}/{datum}")]
    public async Task<ActionResult> CheckReservation([FromBody] List<int> easyChairIds , int userID , DateTime datum){
        try{
                if(datum >= DateTime.Now.AddDays(DaysInAdvance))
                    return BadRequest($"Maksimalno {DaysInAdvance} dana unapred");
                
                var user = await Context.Korisnici.FindAsync(userID);
                if(user == null)
                    return BadRequest("Korisnik nije nađen");
                var swimmer = await Context.Kupaci.Where(p=> p.Korisnik.ID == userID).FirstOrDefaultAsync();
                if(swimmer == null)
                    return BadRequest("Korisnik nije kupac");
                foreach(int easyChairID in easyChairIds)
                {
                    var easyChair = await Context.Lezaljke.FindAsync(easyChairID);
                    if(easyChair == null)
                        return BadRequest($"Lezaljka:{easyChairID} nije nadjena");
                }
                var reservations = await Context.Rezervacije.Where(p=>p.Kupac!.ID == swimmer.ID && p.Datum.Date == datum.Date).CountAsync();

                if(reservations + easyChairIds.Count > maxNumberOfReservations){
                    return BadRequest($"Nije moguce rezervisanje vise od {maxNumberOfReservations} lezaljki");
                }

                foreach(int easyChairID in easyChairIds)
                {
                    var reservation = await Context.Rezervacije.Where(p=> p.Datum.Date == datum.Date && p.Lezaljka!.ID == easyChairID).FirstOrDefaultAsync();
                    if(reservation != null)
                        return BadRequest($"Lezaljka:{easyChairID} je vec rezervisana");
                }
                return Ok("Moguće je za korisnika da rezervise ležaljke");
        }
        catch (Exception ex){
            return BadRequest(ex.Message);    
        }
    }

     [HttpPost("MakeAReservation/{userID}/{datum}")]
      public async Task<ActionResult> MakeAReservation([FromBody] List<int> easyChairIds ,int userID , DateTime datum){
         try{
            var user = await Context.Korisnici.FindAsync(userID);
            if(user == null)
                return BadRequest("Korisnik nije nađen");
            var swimmer = await Context.Kupaci.Where(p=> p.Korisnik.ID == userID).FirstOrDefaultAsync();
            if(swimmer == null)
                return BadRequest("Korisnik nije kupac");
            foreach(int easyChairID in easyChairIds){
                var easyChair = await Context.Lezaljke.FindAsync(easyChairID);

                if(easyChair == null)
                    return BadRequest($"Ležaljka {easyChairID} ne postoji");

                var Newreservation = new Rezervacije{
                    Datum = datum,
                    Kupac = swimmer,
                    Lezaljka = easyChair
                };
                await Context.Rezervacije.AddAsync(Newreservation);
            }
            await Context.SaveChangesAsync();
            return Ok("Uspešna rezervacija");   
         }
         catch(Exception ex){
             return BadRequest(ex.Message);
         }
      }
      [HttpGet("GetReservations/{userID}/{datum}")]
      public async Task<ActionResult> GetReservations(int userID , DateTime datum){
        try{
            var user = await Context.Korisnici.FindAsync(userID);
            if(user == null)
                return BadRequest("Korisnik nije nađen");
            var swimmer = await Context.Kupaci.Where(p => p.Korisnik.ID == userID).FirstOrDefaultAsync();
            if(swimmer == null)
                return BadRequest("Korisnik nije Kupač");
            var reservations = await Context.Rezervacije.Where(p=>p.Kupac!.ID == swimmer.ID && p.Datum.Date == datum.Date).Select(p => new {
                p.Lezaljka!.ID,
                p.Lezaljka.Cena
            }).ToListAsync();
            return Ok(reservations);
            
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
      }
}