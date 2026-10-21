namespace HabitFlow.Application.Exceptions;

public class HabitRecordAlreadyExistsException : Exception
{
    public HabitRecordAlreadyExistsException()
            : base ("Habit record already exists.")
    {
    }
}