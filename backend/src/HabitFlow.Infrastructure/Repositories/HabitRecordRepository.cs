using HabitFlow.Application.Interfaces;
using HabitFlow.Domain;
using HabitFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HabitFlow.Infrastructure.Repositories;

public class HabitRecordRepository : IHabitRecordRepository
{
    private readonly AppDbContext _appDbContext;

    public HabitRecordRepository(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public Task Create(HabitRecord habitRecord)
    {
        _appDbContext.HabitRecords.Add(habitRecord);

        return Task.CompletedTask;
    }

    public async Task DeleteById(long id)
    {
        var habitRecord = await _appDbContext.HabitRecords.FindAsync(id);

        _appDbContext.HabitRecords.Remove(habitRecord);
    }

    public async Task<IEnumerable<HabitRecord>> GetAll()
    {
        return await _appDbContext.HabitRecords.ToListAsync();
    }

    public async Task<IEnumerable<HabitRecord>> GetAllByDate(DateOnly date)
    {
        return await _appDbContext.HabitRecords
            .Where(hr => hr.RecordDate == date)
            .ToListAsync();
    }

    public async Task<IEnumerable<HabitRecord>> GetAllByHabitId(long habitId)
    {
        return await _appDbContext.HabitRecords
            .Where(hr => hr.HabitId == habitId)
            .ToListAsync();
    }

    public async Task<HabitRecord?> GetById(long id)
    {
        return await _appDbContext.HabitRecords.FindAsync(id);
    }

    public async Task<HabitRecord?> GetRecordByHabitIdAndDate(long habitId, DateOnly date)
    {
        return await _appDbContext.HabitRecords
            .Where(hr => hr.HabitId == habitId && hr.RecordDate == date)
            .SingleOrDefaultAsync();
    }

    public Task<HabitRecord> Update(HabitRecord habitRecord)
    {
        _appDbContext.HabitRecords.Update(habitRecord);

        return Task.FromResult(habitRecord);
    }
}