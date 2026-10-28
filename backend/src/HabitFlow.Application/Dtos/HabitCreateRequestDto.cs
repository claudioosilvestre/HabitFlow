using HabitFlow.Domain;

namespace HabitFlow.Application.Dtos;

public class HabitCreateRequestDto
{
    public string Name {get; set;}
    public TimeSpan? Duration {get; set;}
    public HabitPriority HabitPriority {get; set;}
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Description {get; set;}
    public List<DayOfWeek>? DaysOfWeek { get; set; }
}
