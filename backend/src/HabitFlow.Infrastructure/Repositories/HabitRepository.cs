using HabitFlow.Application.Interfaces;
using HabitFlow.Domain;
using HabitFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HabitFlow.Infrastructure.Repositories;

public class HabitRepository : IHabitRepository
{
    private readonly AppDbContext _appDbContext;

    public HabitRepository(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public Task Create(Habit habit)
    {
        _appDbContext.Habits.Add(habit);

        return Task.CompletedTask;
    }

    public async Task DeleteById(long id)
    {
        var habit = await _appDbContext.Habits.FindAsync(id);

        _appDbContext.Habits.Remove(habit);
    }

    public async Task<IEnumerable<Habit>> GetAll()
    {
        return await _appDbContext.Habits.ToListAsync();
    }

    public async Task<Habit?> GetById(long id)
    {
        var habit = await _appDbContext.Habits.FindAsync(id);

        return habit;
    }

    public Task<Habit> Update(Habit habit)
    {
        _appDbContext.Habits.Update(habit);

        return Task.FromResult(habit);
    }
}