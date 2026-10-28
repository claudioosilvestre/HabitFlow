namespace HabitFlow.Domain;

public class HabitRecord
{
    public long Id {get; private set;}
    public long HabitId {get; private set;}
    public HabitState HabitState {get; private set;}
    public DateOnly RecordDate {get; private set;}
    public string? Description {get; private set;}

    public HabitRecord(long habitId, HabitState habitState, DateOnly recordDate, string? description)
    {
        ValidateHabitId(habitId);
        ValidateHabitState(habitState);
        ValidateRecordDate(recordDate);
        ValidateDescription(description);

        HabitId = habitId;
        HabitState = habitState;
        RecordDate = recordDate;
        Description = description;
    }

    public void Update(HabitState habitState, DateOnly recordDate, string? description)
    {
        ValidateHabitState(habitState);
        ValidateRecordDate(recordDate);
        ValidateDescription(description);

        HabitState = habitState;
        RecordDate = recordDate;
        Description = description;
    }

    public void ChangeHabitState(HabitState habitState)
    {
        ValidateHabitState(habitState);

        HabitState = habitState;
    }

    public void ChangeRecordDate(DateOnly recordDate)
    {
        ValidateRecordDate(recordDate);

        RecordDate = recordDate;
    }

    public void ChangeDescription(string? description)
    {
        ValidateDescription(description);

        Description = description;
    }

    private void ValidateRecordDate(DateOnly recordDate)
    {
        DateOnly now = DateOnly.FromDateTime(DateTime.Now);

        if(recordDate > now)
        {
            throw new ArgumentException("Record date cannot be in the future.");
        }
    }

    private void ValidateHabitState(HabitState habitState)
    {
        if(!Enum.IsDefined(typeof(HabitState), habitState))
        {
            throw new ArgumentOutOfRangeException(nameof(habitState), "Habit state is invalid.");
        }
    }

    private void ValidateHabitId(long habitId)
    {
        if(habitId <= 0)
        {
            throw new ArgumentException("Id must be positive.");
        }
    }

    private void ValidateDescription(string? description)
    {
        if(description == null)
        {
            return;
        }

        if(description.Length > 500)
        {
            throw new ArgumentException("Description cannot be longer than 500 characters.");
        }
    }
}