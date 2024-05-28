using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proba.Migrations
{
    /// <inheritdoc />
    public partial class v4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DatumDo",
                table: "ZahtevIzdavanje",
                type: "TIMESTAMP(7)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DatumOd",
                table: "ZahtevIzdavanje",
                type: "TIMESTAMP(7)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DatumDo",
                table: "ZahtevIzdavanje");

            migrationBuilder.DropColumn(
                name: "DatumOd",
                table: "ZahtevIzdavanje");
        }
    }
}
