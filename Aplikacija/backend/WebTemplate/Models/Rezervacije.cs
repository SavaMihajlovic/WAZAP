namespace WebTemplate.Models;
public class Rezervacije {
    [Key]
    public int ID { get; set; }
    public DateTime DatumZaRezervaciju { get; set; }
    public Lezaljka? Lezaljka { get; set; }
    public User? User { get; set; }
}