using HabitFlow.Domain;

namespace HabitFlow.Application.Dtos;

public class HabitRecordUpdateRequestDto
{
    public HabitState HabitState {get; set;}
    public DateOnly RecordDate {get; set;}
    public string? Description {get; set;}
}