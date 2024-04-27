namespace Models;

public class Admin {
    [Key]
    public int ID { get; set; }
    public List<ZahtevPosao>? ZahtevPosao { get; set; }
    public List<ZahtevIzdavanje>? ZahtevIzdavanje { get; set; }
    public required Korisnik Korisnik { get; set; }
}