using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proba.Migrations
{
    /// <inheritdoc />
    public partial class v1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Korisnici",
                columns: table => new
                {
                    ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Ime = table.Column<string>(type: "NVARCHAR2(25)", maxLength: 25, nullable: false),
                    Prezime = table.Column<string>(type: "NVARCHAR2(25)", maxLength: 25, nullable: false),
                    Email = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: false),
                    Lozinka = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    KorisnickoIme = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: false),
                    TipKorisnika = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: false),
                    DatumRodjenja = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnici", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Lezaljke",
                columns: table => new
                {
                    ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Cena = table.Column<double>(type: "BINARY_DOUBLE", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lezaljke", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Admini",
                columns: table => new
                {
                    ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    KorisnikID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admini", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Admini_Korisnici_KorisnikID",
                        column: x => x.KorisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Kupaci",
                columns: table => new
                {
                    ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Slika = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: true),
                    Uverenje = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: true),
                    BrojLezaljki = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    KorisnikID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kupaci", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Kupaci_Korisnici_KorisnikID",
                        column: x => x.KorisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Radnici",
                columns: table => new
                {
                    ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Slika = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: true),
                    Sertifikat = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: true),
                    RID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Radnici", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Radnici_Korisnici_RID",
                        column: x => x.RID,
                        principalTable: "Korisnici",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Rezervacije",
                columns: table => new
                {
                    ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Datum = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    KID = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    LID = table.Column<int>(type: "NUMBER(10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rezervacije", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Rezervacije_Kupaci_KID",
                        column: x => x.KID,
                        principalTable: "Kupaci",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Rezervacije_Lezaljke_LID",
                        column: x => x.LID,
                        principalTable: "Lezaljke",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ZahtevIzdavanje",
                columns: table => new
                {
                    ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Tip_Karte = table.Column<string>(type: "NVARCHAR2(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "NVARCHAR2(20)", maxLength: 20, nullable: false),
                    KID = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    AID = table.Column<int>(type: "NUMBER(10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahtevIzdavanje", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ZahtevIzdavanje_Admini_AID",
                        column: x => x.AID,
                        principalTable: "Admini",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_ZahtevIzdavanje_Kupaci_KID",
                        column: x => x.KID,
                        principalTable: "Kupaci",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ZahtevPosao",
                columns: table => new
                {
                    ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Tip_Posla = table.Column<string>(type: "NVARCHAR2(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "NVARCHAR2(20)", maxLength: 20, nullable: false),
                    Opis = table.Column<string>(type: "NVARCHAR2(150)", maxLength: 150, nullable: true),
                    SRID = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    AID = table.Column<int>(type: "NUMBER(10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahtevPosao", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ZahtevPosao_Admini_AID",
                        column: x => x.AID,
                        principalTable: "Admini",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_ZahtevPosao_Radnici_SRID",
                        column: x => x.SRID,
                        principalTable: "Radnici",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Admini_KorisnikID",
                table: "Admini",
                column: "KorisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Kupaci_KorisnikID",
                table: "Kupaci",
                column: "KorisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Radnici_RID",
                table: "Radnici",
                column: "RID");

            migrationBuilder.CreateIndex(
                name: "IX_Rezervacije_KID",
                table: "Rezervacije",
                column: "KID");

            migrationBuilder.CreateIndex(
                name: "IX_Rezervacije_LID",
                table: "Rezervacije",
                column: "LID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtevIzdavanje_AID",
                table: "ZahtevIzdavanje",
                column: "AID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtevIzdavanje_KID",
                table: "ZahtevIzdavanje",
                column: "KID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtevPosao_AID",
                table: "ZahtevPosao",
                column: "AID");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtevPosao_SRID",
                table: "ZahtevPosao",
                column: "SRID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rezervacije");

            migrationBuilder.DropTable(
                name: "ZahtevIzdavanje");

            migrationBuilder.DropTable(
                name: "ZahtevPosao");

            migrationBuilder.DropTable(
                name: "Lezaljke");

            migrationBuilder.DropTable(
                name: "Kupaci");

            migrationBuilder.DropTable(
                name: "Admini");

            migrationBuilder.DropTable(
                name: "Radnici");

            migrationBuilder.DropTable(
                name: "Korisnici");
        }
    }
}
