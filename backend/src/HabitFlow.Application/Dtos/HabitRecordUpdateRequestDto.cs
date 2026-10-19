using HabitFlow.Domain;

namespace HabitFlow.Application.Dtos;

public class HabitRecordUpdateRequestDto
{
    public long HabitId {get; set;}
    public HabitState HabitState {get; set;}
    public DateOnly RecordDate {get; set;}
    public string? Description {get; set;}
}