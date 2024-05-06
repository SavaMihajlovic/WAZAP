using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proba.Migrations
{
    /// <inheritdoc />
    public partial class v3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BrojLezaljki",
                table: "Kupaci");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BrojLezaljki",
                table: "Kupaci",
                type: "NUMBER(10)",
                nullable: false,
                defaultValue: 0);
        }
    }
}
