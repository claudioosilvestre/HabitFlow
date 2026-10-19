using HabitFlow.Application.Dtos;

namespace HabitFlow.Application.Interfaces;

public interface IHabitRecordService
{
    Task<HabitRecordResponseDto> GetById(long id);
    Task<IEnumerable<HabitRecordResponseDto>> GetAll();
    Task<HabitRecordResponseDto> GetRecordByHabitIdAndDate(long habitId, DateOnly date);
    Task<IEnumerable<HabitRecordResponseDto>> GetAllByHabitId(long habitId);
    Task<IEnumerable<HabitRecordResponseDto>> GetAllByDate(DateOnly date);
    Task<HabitRecordResponseDto> Create(HabitRecordCreateRequestDto habitRecordCreateRequestDto);
    Task<HabitRecordResponseDto> Update(long id, HabitRecordUpdateRequestDto habitRecordUpdateRequestDto);
    Task DeleteById(long id);
}