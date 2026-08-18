using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudServices.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNewsArticleCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "NewsArticles",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticles_Category",
                table: "NewsArticles",
                column: "Category");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_NewsArticles_Category",
                table: "NewsArticles");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "NewsArticles");
        }
    }
}
