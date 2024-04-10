
[ApiController]
[Route("[controller]")]
public class LezaljkaController : ControllerBase
{       
    public Context Context { get; set; }
     public LezaljkaController(Context context)
     {
         Context = context;
     }
     [HttpPost("DodajLezaljke/{cena}/{kolicina}")]
public async Task<ActionResult> DodajLezaljke(double cena, uint kolicina)
{
    try
    {
        for (int i = 0; i < kolicina; i++)
        {
            var lezaljka = new Lezaljka
            {
                Cena = cena,
            };
            
            await Context.Lezaljke.AddAsync(lezaljka);
        }
        
        await Context.SaveChangesAsync();

        return Ok($"Dodato je {kolicina} lezaljki sa cenom: {cena}");
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}

}