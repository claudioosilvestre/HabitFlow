using HabitFlow.Application.Dtos;

namespace HabitFlow.Application.Interfaces;

public interface IHabitService
{
    Task<HabitResponseDto> GetById(long id);
    Task<IEnumerable<HabitResponseDto>> GetAll();
    Task<HabitResponseDto> Create(HabitCreateRequestDto habitCreateRequestDto);
    Task<HabitResponseDto> Update(long id, HabitUpdateRequestDto habitUpdateRequestDto);
    Task DeleteById(long id);
}