using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcityChallenge.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDescripcionToPedido : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "Pedidos",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "Pedidos");
        }
    }
}
