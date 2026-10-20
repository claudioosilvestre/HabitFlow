using HabitFlow.Application.Dtos;
using HabitFlow.Domain;

namespace HabitFlow.Application.Converters;

public class HabitConverter
{
    public HabitResponseDto ToResponseDto(Habit habit)
    {
        var habitResponseDto = new HabitResponseDto();
        habitResponseDto.Id = habit.Id;
        habitResponseDto.Name = habit.Name;
        habitResponseDto.StartDate = habit.StartDate;
        habitResponseDto.HabitPriority = habit.HabitPriority;
        habitResponseDto.EndDate = habit.EndDate;
        habitResponseDto.Duration = habit.Duration;
        habitResponseDto.Description = habit.Description;
        habitResponseDto.CreatedAt = habit.CreatedAt;
        
        return habitResponseDto;
    }
}