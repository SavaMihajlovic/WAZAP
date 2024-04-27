namespace Models;

public class Kupac {
    [Key]
    public int ID { get; set; }
    [MaxLength(50)]
    public string? Slika { get; set; }
    [MaxLength(50)] 
    public string? Uverenje { get; set; }
    public int BrojLezaljki { get; set; }

    public List<ZahtevIzdavanje>? ZahtevIzdavanje { get; set; }
    public List<Rezervacije>? Rezervacije { get; set; }
    public required Korisnik Korisnik { get; set; }
}