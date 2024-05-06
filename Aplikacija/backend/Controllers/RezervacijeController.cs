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
     [HttpPost("MakeAReservation/{userID}/{easyChairID}/{datum}")]
     public async Task<ActionResult> MakeAReservation(int userID ,int easyChairID , DateTime datum){
        try{
            if(datum >= DateTime.Now.AddDays(DaysInAdvance))
                return BadRequest($"Maksimalno {DaysInAdvance} dana unapred");
            var user = await Context.Korisnici.FindAsync(userID);
            if(user == null)
                return BadRequest("Korisnik nije nadjen");
            var swimmer = await Context.Kupaci.Where(p=> p.Korisnik.ID == userID).FirstOrDefaultAsync();
            if(swimmer == null)
                return BadRequest("Korisnik nije kupac");
            var easyChair = await Context.Lezaljke.FindAsync(easyChairID);
            if(easyChair == null)
                return BadRequest("Lezaljka nije nadjena");
            var reservations = await Context.Rezervacije.Where(p=>p.Kupac!.ID == swimmer.ID && p.Datum.Day == datum.Day).CountAsync();
            if(reservations >= maxNumberOfReservations){
                return BadRequest($"Nije moguce rezervisanje vise od {maxNumberOfReservations} lezaljki");
            }
            var reservation = await Context.Rezervacije.Where(p=> p.Datum.Day == datum.Day && p.Lezaljka!.ID == easyChairID).FirstOrDefaultAsync();
            if(reservation != null)
                return BadRequest($"Lezaljka:{easyChairID} je vec rezervisana");
            var Newreservation = new Rezervacije{
                Datum = datum,
                Kupac = swimmer,
                Lezaljka = easyChair
            };
            await Context.Rezervacije.AddAsync(Newreservation);
            await Context.SaveChangesAsync();
            return Ok("Uspesna rezervacija");   
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
}