using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proba.Migrations
{
    /// <inheritdoc />
    public partial class v6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Opis",
                table: "ZahtevPosao",
                type: "NVARCHAR2(2000)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "NVARCHAR2(150)",
                oldMaxLength: 150,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DatumZaposlenja",
                table: "ZahtevPosao",
                type: "TIMESTAMP(7)",
                maxLength: 150,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DatumZaposlenja",
                table: "ZahtevPosao");

            migrationBuilder.AlterColumn<string>(
                name: "Opis",
                table: "ZahtevPosao",
                type: "NVARCHAR2(150)",
                maxLength: 150,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "NVARCHAR2(2000)",
                oldNullable: true);
        }
    }
}
