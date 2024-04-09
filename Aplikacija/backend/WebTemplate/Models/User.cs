namespace WebTemplate.Models;

public class User {
    [Key]
    public int ID { get; set; }
    [MaxLength(25)]
    public required string UserName { get; set; }
    [MaxLength(100)]
    public required string Password { get; set; }
    [Length(5,20)]
    public required string TipUsera { get; set; }
    [MaxLength(50)]
    public string? Slika { get; set; }
    [MaxLength(50)]
    public string? Sertifikat { get; set; }
    public List<Rezervacije>? Rezervacije { get; set; }
}
