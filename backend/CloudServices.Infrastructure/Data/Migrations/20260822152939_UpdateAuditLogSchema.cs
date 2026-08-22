using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudServices.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAuditLogSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AffiliateApplications_Email",
                table: "AffiliateApplications");

            migrationBuilder.RenameColumn(
                name: "Payload",
                table: "AuditLogs",
                newName: "OldValues");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "AuditLogs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)");

            migrationBuilder.AddColumn<string>(
                name: "AffectedColumns",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NewValues",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryKey",
                table: "AuditLogs",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TableName",
                table: "AuditLogs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AffectedColumns",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "NewValues",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "PrimaryKey",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "TableName",
                table: "AuditLogs");

            migrationBuilder.RenameColumn(
                name: "OldValues",
                table: "AuditLogs",
                newName: "Payload");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "AuditLogs",
                type: "varchar(50)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateApplications_Email",
                table: "AffiliateApplications",
                column: "Email",
                unique: true);
        }
    }
}
