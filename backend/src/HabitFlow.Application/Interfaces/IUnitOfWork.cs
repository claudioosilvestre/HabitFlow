namespace HabitFlow.Application.Interfaces;

public interface IUnitOfWork
{
    Task SaveChangesAsync();
}