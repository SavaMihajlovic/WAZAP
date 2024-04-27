namespace Models;

public class Lezaljka {
    [Key]
    public int ID { get; set; }
    public required double Cena { get; set; }
    public List<Rezervacije>? Rezervacije { get; set; }
}