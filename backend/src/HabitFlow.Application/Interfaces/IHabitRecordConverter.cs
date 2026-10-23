using HabitFlow.Application.Dtos;
using HabitFlow.Domain;

namespace HabitFlow.Application.Interfaces;

public interface IHabitRecordConverter
{
    HabitRecordResponseDto ToResponseDto(HabitRecord habitRecord);
}