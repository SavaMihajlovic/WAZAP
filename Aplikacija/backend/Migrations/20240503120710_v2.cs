using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proba.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ForgotPasswordExp",
                table: "Korisnici",
                type: "TIMESTAMP(7)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TokenForgotPassword",
                table: "Korisnici",
                type: "NVARCHAR2(2000)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ForgotPasswordExp",
                table: "Korisnici");

            migrationBuilder.DropColumn(
                name: "TokenForgotPassword",
                table: "Korisnici");
        }
    }
}
