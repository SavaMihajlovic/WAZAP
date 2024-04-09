using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebTemplate.Migrations
{
    /// <inheritdoc />
    public partial class v1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Lezaljke",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Cena = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lezaljke", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Useri",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TipUsera = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Slika = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Sertifikat = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Useri", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Rezervacije",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DatumZaRezervaciju = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LezaljkaID = table.Column<int>(type: "int", nullable: true),
                    UserID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rezervacije", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Rezervacije_Lezaljke_LezaljkaID",
                        column: x => x.LezaljkaID,
                        principalTable: "Lezaljke",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Rezervacije_Useri_UserID",
                        column: x => x.UserID,
                        principalTable: "Useri",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rezervacije_LezaljkaID",
                table: "Rezervacije",
                column: "LezaljkaID");

            migrationBuilder.CreateIndex(
                name: "IX_Rezervacije_UserID",
                table: "Rezervacije",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rezervacije");

            migrationBuilder.DropTable(
                name: "Lezaljke");

            migrationBuilder.DropTable(
                name: "Useri");
        }
    }
}
