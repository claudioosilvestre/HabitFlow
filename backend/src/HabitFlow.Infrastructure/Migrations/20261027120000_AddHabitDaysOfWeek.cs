using HabitFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitFlow.Infrastructure.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20261027120000_AddHabitDaysOfWeek")]
public partial class AddHabitDaysOfWeek : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<int>(
            name: "DaysOfWeekMask",
            table: "Habits",
            type: "int",
            nullable: false,
            defaultValue: 127);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "DaysOfWeekMask", table: "Habits");
    }
}
