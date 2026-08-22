using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudServices.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPreviousRefreshTokenToAppUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PreviousRefreshToken",
                table: "AppUsers",
                type: "varchar(255)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PreviousRefreshTokenExpiryTime",
                table: "AppUsers",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PreviousRefreshToken",
                table: "AppUsers");

            migrationBuilder.DropColumn(
                name: "PreviousRefreshTokenExpiryTime",
                table: "AppUsers");
        }
    }
}
