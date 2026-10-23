using HabitFlow.Application.Dtos;
using HabitFlow.Application.Exceptions;
using HabitFlow.Application.Interfaces;
using HabitFlow.Domain;

namespace HabitFlow.Application.Services;

public class HabitService : IHabitService
{
    private readonly IHabitRepository _habitRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHabitConverter _habitConverter;

    public HabitService(IHabitRepository habitRepository, IUnitOfWork unitOfWork, IHabitConverter habitConverter)
    {
        _habitRepository = habitRepository;
        _unitOfWork = unitOfWork;
        _habitConverter = habitConverter;
    }

    public async Task<HabitResponseDto> Create(HabitCreateRequestDto habitCreateRequestDto)
    {
        var habit = new Habit(
            habitCreateRequestDto.Name,
            habitCreateRequestDto.Duration,
            habitCreateRequestDto.HabitPriority,
            habitCreateRequestDto.StartDate,
            habitCreateRequestDto.EndDate,
            habitCreateRequestDto.Description
        );

        await _habitRepository.Create(habit);

        await _unitOfWork.SaveChangesAsync();

        return _habitConverter.ToResponseDto(habit);
    }

    public async Task DeleteById(long id)
    {
        await GetHabitById(id);

        await _habitRepository.DeleteById(id);

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<HabitResponseDto>> GetAll()
    {
        var habits = await _habitRepository.GetAll();

        return habits.Select(h => _habitConverter.ToResponseDto(h)).ToList();
    }

    public async Task<HabitResponseDto> GetById(long id)
    {
        var habit = await GetHabitById(id);

        return _habitConverter.ToResponseDto(habit);
    }

    public async Task<HabitResponseDto> Update(long id, HabitUpdateRequestDto habitUpdateRequestDto)
    {
        var habit = await GetHabitById(id);
        
        habit.UpdateHabit(
            habitUpdateRequestDto.Name,
            habitUpdateRequestDto.Duration,
            habitUpdateRequestDto.HabitPriority,
            habitUpdateRequestDto.StartDate,
            habitUpdateRequestDto.EndDate,
            habitUpdateRequestDto.Description
        );

        await _habitRepository.Update(habit);

        await _unitOfWork.SaveChangesAsync();

        return _habitConverter.ToResponseDto(habit);
    }

    private async Task<Habit> GetHabitById(long id)
    {
        if(id <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(id), "Id must be positive");
        }

        var habit = await _habitRepository.GetById(id);

        if(habit == null)
        {
            throw new HabitNotFoundException();
        }
        
        return habit;
    }
}