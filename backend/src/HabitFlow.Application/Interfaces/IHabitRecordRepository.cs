using HabitFlow.Domain;

namespace HabitFlow.Application.Interfaces;

public interface IHabitRecordRepository
{
    Task<HabitRecord?> GetById(long id);
    Task<IEnumerable<HabitRecord>> GetAll();
    Task<HabitRecord?> GetRecordByHabitIdAndDate(long habitId, DateOnly date);
    Task<IEnumerable<HabitRecord>> GetAllByHabitId(long habitId);
    Task<IEnumerable<HabitRecord>> GetAllByDate(DateOnly date);
    Task Create(HabitRecord habitRecord);
    Task<HabitRecord> Update(HabitRecord habitRecord);
    Task DeleteById(long id);
}