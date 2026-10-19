using HabitFlow.Domain;

namespace HabitFlow.Application.Interfaces;

public interface IHabitRepository
{
    Task<Habit?> GetById(long id);
    Task<IEnumerable<Habit>> GetAll();
    Task Create (Habit habit);
    Task<Habit> Update(Habit habit);
    Task DeleteById(long id);
}