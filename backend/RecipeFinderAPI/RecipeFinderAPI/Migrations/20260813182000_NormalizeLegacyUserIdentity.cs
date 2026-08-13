using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using RecipeFinderAPI.Data;

#nullable disable

namespace RecipeFinderAPI.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260813182000_NormalizeLegacyUserIdentity")]
public partial class NormalizeLegacyUserIdentity : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // This repeats the idempotent normalization for databases that applied
        // the first hardening migration before its deployment preflight existed.
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
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // Canonical casing and surrounding-whitespace removal are intentionally irreversible.
    }
}
