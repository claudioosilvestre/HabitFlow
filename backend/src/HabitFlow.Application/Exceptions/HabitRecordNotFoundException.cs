namespace HabitFlow.Application.Exceptions;

public class HabitRecordNotFoundException : Exception
{
    public HabitRecordNotFoundException() 
        : base ("Habit record not found.")
    {
    }
}