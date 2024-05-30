namespace Models;

public class Admin {
    [Key]
    public int ID { get; set; }
    [JsonIgnore]
    public List<ZahtevPosao>? ZahtevPosao { get; set; }
    [JsonIgnore]
    public List<ZahtevIzdavanje>? ZahtevIzdavanje { get; set; }

    public required Korisnik Korisnik { get; set; }
}