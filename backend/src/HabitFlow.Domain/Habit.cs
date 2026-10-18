namespace HabitFlow.Domain;

public class Habit
{
    public long Id {get; private set;}
    public string Name {get; private set;}
    public TimeSpan? Duration {get; private set;}
    public HabitPriority HabitPriority {get; private set;}
    public DateOnly StartDate { get; private set; }
    public DateOnly? EndDate { get; private set; }
    public DateTime CreatedAt {get; private set;}
    public string? Description {get; private set;}

    public Habit(string name, TimeSpan? duration, HabitPriority priority, DateOnly startDate, DateOnly? endDate, string? description)
    {
        Name = ValidateName(name);
        ValidateDuration(duration);
        ValidateHabitPriority(priority);
        ValidateDates(startDate, endDate);
        Description = ValidateDescription(description);

        Duration = duration;
        HabitPriority = priority;
        StartDate = startDate;
        EndDate = endDate;
        CreatedAt = DateTime.UtcNow;
    }

    public void ChangeName(string name)
    {
        Name= ValidateName(name);
    }

    public void ChangeDescription(string? description)
    {
        Description = ValidateDescription(description);
    }

    public void ChangeEndDate(DateOnly? endDate)
    {
        if(endDate == null)
        {
            EndDate = null;
            return;
        }

        if(StartDate > endDate)
        {
            throw new ArgumentException("End date cannot be less than the start date.");
        }

        EndDate = endDate;
    }

    public void ChangeStartDate(DateOnly startDate)
    {
        ValidateDates(startDate, EndDate);

        StartDate = startDate;
    }

    public void ChangeHabitPriority(HabitPriority habitPriority)
    {
        ValidateHabitPriority(habitPriority);

        HabitPriority = habitPriority;
    }

    public void  ChangeDuration(TimeSpan? duration)
    {
        ValidateDuration(duration);

        Duration = duration;
    }

    private void ValidateDates(DateOnly startDate, DateOnly? endDate)
    {
        if(endDate == null)
        {
            return;
        }

        if(startDate > endDate)
        {
            throw new ArgumentException("End date cannot be less than the start date.");
        }
    }
    private void ValidateHabitPriority(HabitPriority habitPriority)
    {
        if(!Enum.IsDefined(typeof(HabitPriority), habitPriority))
        {
            throw new ArgumentOutOfRangeException(nameof(habitPriority), "Habit priority is invalid.");
        }
    }
    private void ValidateDuration(TimeSpan? duration)
    {
        if(duration == null)
        {
            return;
        }
        if(duration <= TimeSpan.Zero)
        {
            throw new ArgumentOutOfRangeException(nameof(duration), "Duration cannot be zero or negative.");
        }
    }
    private string ValidateName(string name)
    {
        if(name == null)
        {
            throw new ArgumentNullException("Name cannot be null");
        }

        var normalizedName = name.Trim();

        if(string.IsNullOrWhiteSpace(normalizedName))
        {
            throw new ArgumentException("Name cannot be empty or null.");
        } else if(normalizedName.Length > 100)
        {
            throw new ArgumentException("Name cannot be longer than 100 characters.");
        }

        return normalizedName;
    }

    private string? ValidateDescription(string? description)
    {
        if(description == null)
        {
            return null;
        }

        var normalizedDescription = description.Trim();

        if(normalizedDescription.Length > 500)
        {
            throw new ArgumentException("Description cannot be longer than 500 characters.");
        }

        return normalizedDescription;
    }
}