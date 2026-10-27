using HabitFlow.Application.Dtos;
using HabitFlow.Application.Interfaces;
using HabitFlow.Domain;

namespace HabitFlow.Application.Converters;

public class HabitConverter : IHabitConverter
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
        habitResponseDto.DaysOfWeek = habit.DaysOfWeek.ToList();
        
        return habitResponseDto;
    }
}
