using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models;

public class Radnik {
    [Key]
    public int ID { get; set; }
    [MaxLength(50)]
    public string? Slika { get; set; }
    [MaxLength(50)]
    public string? Sertifikat { get; set; }
    [JsonIgnore]
    public List<ZahtevPosao>? ZahtevPosao { get; set; }
    [ForeignKey("RID")]
    public required Korisnik Korisnik { get; set; }
}