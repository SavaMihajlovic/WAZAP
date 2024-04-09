namespace WebTemplate.Models;

public class Context : DbContext
{
    // DbSet kolekcije!
    public DbSet<User> Useri { get; set; }
    public DbSet<Lezaljka> Lezaljke { get; set; }
    public DbSet<Rezervacije> Rezervacije { get; set; }
    public Context(DbContextOptions options) : base(options)
    {
        
    }
}
