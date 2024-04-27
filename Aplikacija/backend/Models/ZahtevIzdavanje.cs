using System.ComponentModel.DataAnnotations.Schema;

namespace Models;
public class ZahtevIzdavanje {
    [Key]
    public int ID { get; set; }
    [MaxLength(20)]
    public required string Tip_Karte { get; set; }
    [MaxLength(20)]
    public required string Status { get; set; }

    [ForeignKey("KID")]
    public Kupac? Kupac { get; set; }
    [ForeignKey("AID")]
    public Admin? Admin { get; set; }
}