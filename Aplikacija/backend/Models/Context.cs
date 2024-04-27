namespace Models;

public class Context : DbContext
{
    public DbSet<Korisnik> Korisnici { get; set; }
    public DbSet<Kupac> Kupaci { get; set; }
    public DbSet<Radnik> Radnici { get; set; }
    public DbSet<Admin> Admini { get; set; }
    public DbSet<Lezaljka> Lezaljke { get; set; }
    public DbSet<Rezervacije> Rezervacije { get; set; }
    public DbSet<ZahtevIzdavanje> ZahtevIzdavanje { get; set; }
    public DbSet<ZahtevPosao> ZahtevPosao { get; set; }
    public Context(DbContextOptions options) : base(options)
    {
        
    }
}
