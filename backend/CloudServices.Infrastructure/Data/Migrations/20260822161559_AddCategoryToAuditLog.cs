using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudServices.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryToAuditLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "AuditLogs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Hệ Thống");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Category",
                table: "AuditLogs",
                column: "Category");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_Category",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "AuditLogs");
        }
    }
}
