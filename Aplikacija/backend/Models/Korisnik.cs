namespace Models;

public class Korisnik {
    [Key]
    public int ID { get; set; }
    [MaxLength(25)]
    public required string Ime { get; set; }
    [MaxLength(25)]
    public required string Prezime { get; set; }
    [MaxLength(50)]
    public required string Email { get; set; }
    [MaxLength(100)]
    public required string Lozinka { get; set; }
    [MaxLength(50)]
    public required string KorisnickoIme { get; set; }
    [MaxLength(50)]
    public required string TipKorisnika  { get; set; }
    public required DateTime DatumRodjenja { get; set; }

    public string? TokenForgotPassword { get; set; }

    public DateTime? ForgotPasswordExp { get; set; }
}