using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecipeFinderAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddBlogCreatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Blogs",
                newName: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Blogs",
                newName: "CreatedDate");
        }
    }
}
