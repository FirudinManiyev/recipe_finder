using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using RecipeFinderAPI.Data;

#nullable disable

namespace RecipeFinderAPI.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260813181000_HardenUserIdentityUniqueness")]
public partial class HardenUserIdentityUniqueness : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            IF EXISTS (
                SELECT 1
                FROM Users
                GROUP BY LOWER(LTRIM(RTRIM(Username)))
                HAVING COUNT(*) > 1
            ) OR EXISTS (
                SELECT 1
                FROM Users
                GROUP BY LOWER(LTRIM(RTRIM(Email)))
                HAVING COUNT(*) > 1
            )
            BEGIN
                ;THROW 51000, 'User identity migration blocked: normalized usernames or emails are duplicated.', 1;
            END;

            IF EXISTS (
                SELECT 1 FROM Users
                WHERE LEN(LTRIM(RTRIM(Username))) NOT BETWEEN 1 AND 50
                   OR LEN(LTRIM(RTRIM(Email))) NOT BETWEEN 1 AND 150
                   OR LEN(LTRIM(RTRIM(Role))) NOT BETWEEN 1 AND 20
                   OR LEN(PasswordHash) NOT BETWEEN 1 AND 512
            )
            BEGIN
                ;THROW 51001, 'User identity migration blocked: one or more values exceed the new limits or are empty.', 1;
            END;

            UPDATE Users
            SET Username = LTRIM(RTRIM(Username)),
                Email = LOWER(LTRIM(RTRIM(Email))),
                Role = CASE LOWER(LTRIM(RTRIM(Role)))
                    WHEN 'admin' THEN 'Admin'
                    WHEN 'user' THEN 'User'
                    ELSE LTRIM(RTRIM(Role))
                END;
            """);

        migrationBuilder.AlterColumn<string>(
            name: "Username",
            table: "Users",
            type: "nvarchar(50)",
            maxLength: 50,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(max)");

        migrationBuilder.AlterColumn<string>(
            name: "Role",
            table: "Users",
            type: "nvarchar(20)",
            maxLength: 20,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(max)");

        migrationBuilder.AlterColumn<string>(
            name: "PasswordHash",
            table: "Users",
            type: "nvarchar(512)",
            maxLength: 512,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(max)");

        migrationBuilder.AlterColumn<string>(
            name: "Email",
            table: "Users",
            type: "nvarchar(150)",
            maxLength: 150,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(max)");

        migrationBuilder.CreateIndex(
            name: "IX_Users_Email",
            table: "Users",
            column: "Email",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_Users_Username",
            table: "Users",
            column: "Username",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(name: "IX_Users_Email", table: "Users");
        migrationBuilder.DropIndex(name: "IX_Users_Username", table: "Users");

        migrationBuilder.AlterColumn<string>(
            name: "Username",
            table: "Users",
            type: "nvarchar(max)",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(50)",
            oldMaxLength: 50);

        migrationBuilder.AlterColumn<string>(
            name: "Role",
            table: "Users",
            type: "nvarchar(max)",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(20)",
            oldMaxLength: 20);

        migrationBuilder.AlterColumn<string>(
            name: "PasswordHash",
            table: "Users",
            type: "nvarchar(max)",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(512)",
            oldMaxLength: 512);

        migrationBuilder.AlterColumn<string>(
            name: "Email",
            table: "Users",
            type: "nvarchar(max)",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(150)",
            oldMaxLength: 150);
    }
}
