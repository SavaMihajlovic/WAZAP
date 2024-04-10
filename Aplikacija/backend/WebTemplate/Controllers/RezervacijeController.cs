[ApiController]
[Route("[controller]")]
public class RezervacijeController : ControllerBase
{       
     public uint MaksimalnoLezaljki = 5;
     public Context Context { get; set; }
     public RezervacijeController(Context context)
     {
         Context = context;
     }
     [HttpPost("DodeliLezaljkeKupacu/{userID}/{Datum}")]
     public async Task<ActionResult> DodeliLezaljkeKupacu(int userID , int[] lezaljkeID , DateTime Datum){
        try{
        var user = await Context.Useri.Where(p => p.ID == userID && p.TipUsera == "Kupac").FirstOrDefaultAsync();
        if(user == null){
            return BadRequest("Kupac nije nadjen");
        }
        if(lezaljkeID.Length > MaksimalnoLezaljki){
            return BadRequest($"Maksimalno {MaksimalnoLezaljki} lezaljki");
        }
        for(int i = 0; i < lezaljkeID.Length; i++){
            var lezaljke = await Context.Lezaljke.Where(p => p.ID == lezaljkeID[i]).FirstOrDefaultAsync();
            if(lezaljke == null)
                return BadRequest("Lezaljka nije nadjena");
            var rezervacije = new Rezervacije {
                User = user,
                Lezaljka = lezaljke,
                DatumZaRezervaciju = Datum
            };
            await Context.Rezervacije.AddAsync(rezervacije);
        }
        await Context.SaveChangesAsync();
        return Ok($"Korisnik: {user.UserName} je rezervisao lezaljke za dan: {Datum}");

        }catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     [HttpGet("PrikaziRezervisaneLezaljke/{userID}/{Datum}")]
     public async Task<ActionResult> PrikaziRezervisaneLezaljke(int userID , DateTime Datum){
        try{
            var user = await Context.Useri.Where(p => p.ID == userID && p.TipUsera == "Kupac").FirstOrDefaultAsync();
            if(user == null)
                return BadRequest($"Korisnik nije nadjen");
            var rezervacije = await Context.Rezervacije.Where(p => p.User!.ID == userID && p.DatumZaRezervaciju == Datum).Select(p => new {
                p.Lezaljka!.ID,
                p.Lezaljka.Cena
            }).ToListAsync();
            return Ok(rezervacije);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
     [HttpGet("UkupnaCena/{userID}/{Datum}")]
      public async Task<ActionResult> UkupnaCena(int userID , DateTime Datum){
        try{
            var user = await Context.Useri.Where(p => p.ID == userID && p.TipUsera == "Kupac").FirstOrDefaultAsync();
            if(user == null)
                return BadRequest($"Korisnik nije nadjen");
            var UkupnaCena = await Context.Rezervacije.Where(p => p.User!.ID == userID && p.DatumZaRezervaciju == Datum).SumAsync(p => p.Lezaljka!.Cena);
            return Ok(UkupnaCena);
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
     }
}