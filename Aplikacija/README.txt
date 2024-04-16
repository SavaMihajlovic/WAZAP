Prodavnica:

- ID : int
- Naziv : string
- BrojStolova: uint
- Pripada: List<Pripada>
- Zarada : double


Pripada:

- ID : int
- Kolicina : uint
- ProdavnicaID : uint // Prodavnica : Prodavnica
- SastojakID : uint // Sastojak : Sastojak


Sastojak:

- ID : int
- Naziv : string
- CenaPoKomadu : double
- SastojakU : Sastojak