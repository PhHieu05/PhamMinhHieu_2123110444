using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhamMinhHieu_2123110444.Migrations
{
    /// <inheritdoc />
    public partial class AddClassTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClassId",
                table: "Students",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Classes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClassName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SchoolYear = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Classes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Students_ClassId",
                table: "Students",
                column: "ClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Classes_ClassId",
                table: "Students",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Classes_ClassId",
                table: "Students");

            migrationBuilder.DropTable(
                name: "Classes");

            migrationBuilder.DropIndex(
                name: "IX_Students_ClassId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "ClassId",
                table: "Students");
        }
    }
}
