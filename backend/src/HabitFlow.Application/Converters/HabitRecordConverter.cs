using HabitFlow.Application.Dtos;
using HabitFlow.Domain;

namespace HabitFlow.Application.Converters;

public class HabitRecordConverter
{
    public HabitRecordResponseDto ToResponseDto(HabitRecord habitRecord)
    {
        var habitRecordResponseDto = new HabitRecordResponseDto();
        habitRecordResponseDto.Id = habitRecord.Id;
        habitRecordResponseDto.RecordDate = habitRecord.RecordDate;
        habitRecordResponseDto.HabitState = habitRecord.HabitState;
        habitRecordResponseDto.HabitId = habitRecord.HabitId;
        habitRecordResponseDto.Description = habitRecord.Description;

        return habitRecordResponseDto;
    }
}