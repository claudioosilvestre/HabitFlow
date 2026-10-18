using HabitFlow.Domain;
using Microsoft.EntityFrameworkCore;

namespace HabitFlow.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public DbSet<Habit> Habits => Set<Habit>();
    public DbSet<HabitRecord> HabitRecords => Set<HabitRecord>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        modelBuilder.Entity<Habit>(entity =>
        {
            entity.HasKey(h => h.Id);
            entity.Property(h => h.Name).IsRequired().HasMaxLength(100);
            entity.Property(h => h.Description).HasMaxLength(500);
            entity.Property(h => h.HabitPriority).HasConversion<string>();

            entity.HasMany<HabitRecord>()
                    .WithOne()
                    .HasForeignKey(hr => hr.HabitId)
                    .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<HabitRecord>(entity =>
        {
            entity.HasKey(hr => hr.Id);
            entity.Property(hr => hr.HabitState).HasConversion<string>();
            entity.Property(hr => hr.Description).HasMaxLength(500);
        });
    }
}