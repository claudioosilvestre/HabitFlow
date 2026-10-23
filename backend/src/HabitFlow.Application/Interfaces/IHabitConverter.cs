using HabitFlow.Application.Dtos;
using HabitFlow.Domain;

namespace HabitFlow.Application.Interfaces;

public interface IHabitConverter
{
    HabitResponseDto ToResponseDto(Habit habit);
}