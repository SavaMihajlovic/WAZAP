using System.Text.Json.Serialization;

namespace Models;

public class Lezaljka {
    [Key]
    public int ID { get; set; }
    public required double Cena { get; set; }
    [JsonIgnore]
    public List<Rezervacije>? Rezervacije { get; set; }
}