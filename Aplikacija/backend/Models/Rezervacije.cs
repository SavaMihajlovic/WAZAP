using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Rezervacije {
    [Key]
    public int ID { get; set; }
    public required DateTime Datum { get; set; }
    [ForeignKey("KID")]
    public Kupac? Kupac { get; set; }
    [ForeignKey("LID")]
    public Lezaljka? Lezaljka { get; set; }
}