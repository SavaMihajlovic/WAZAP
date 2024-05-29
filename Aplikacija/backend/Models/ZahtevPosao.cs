using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class ZahtevPosao {
    [Key]
    public int ID { get; set; }
    [MaxLength(20)]
    public required string Tip_Posla { get; set; }
    [MaxLength(20)]
    public required string Status { get; set; }
    [MaxLength(150)]

    public DateTime? DatumZaposlenja { get; set; }

    public string? Opis { get; set; }

    [ForeignKey("SRID")]
    public Radnik? Radnik { get; set; }
    [ForeignKey("AID")]
    public Admin? Admin { get; set; }
}