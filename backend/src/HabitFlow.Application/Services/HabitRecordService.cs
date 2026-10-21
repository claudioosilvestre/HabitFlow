using HabitFlow.Application.Converters;
using HabitFlow.Application.Dtos;
using HabitFlow.Application.Exceptions;
using HabitFlow.Application.Interfaces;
using HabitFlow.Domain;

namespace HabitFlow.Application.Services;

public class HabitRecordService : IHabitRecordService
{
    private readonly IHabitRecordRepository _habitRecordRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly HabitRecordConverter _habitRecordConverter;
    private readonly IHabitRepository _habitRepository;

    public HabitRecordService(IHabitRecordRepository habitRecordRepository, IUnitOfWork unitOfWork, HabitRecordConverter habitRecordConverter, IHabitRepository habitRepository)
    {
        _habitRecordRepository = habitRecordRepository;
        _unitOfWork = unitOfWork;
        _habitRecordConverter = habitRecordConverter;
        _habitRepository = habitRepository;
    }

    public async Task<HabitRecordResponseDto> Create(HabitRecordCreateRequestDto habitRecordCreateRequestDto)
    {
        var habit = await _habitRepository.GetById(habitRecordCreateRequestDto.HabitId);
        
        if(habit == null)
        {
            throw new HabitNotFoundException();
        }

        var habitRecordVerification = await _habitRecordRepository.GetRecordByHabitIdAndDate(habitRecordCreateRequestDto.HabitId, habitRecordCreateRequestDto.RecordDate);
        
        if(habitRecordVerification != null)
        {
            throw new HabitRecordAlreadyExistsException();
        }

        var habitRecord = new HabitRecord(
            habitRecordCreateRequestDto.HabitId,
            habitRecordCreateRequestDto.HabitState,
            habitRecordCreateRequestDto.RecordDate,
            habitRecordCreateRequestDto.Description
        );

        await _habitRecordRepository.Create(habitRecord);

        await _unitOfWork.SaveChangesAsync();

        return _habitRecordConverter.ToResponseDto(habitRecord);
    }

    public async Task DeleteById(long id)
    {
        await GetHabitRecordById(id);

        await _habitRecordRepository.DeleteById(id);

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<HabitRecordResponseDto>> GetAll()
    {
        var habitRecords = await _habitRecordRepository.GetAll();

        return habitRecords.Select(hr => _habitRecordConverter.ToResponseDto(hr)).ToList();
    }

    public async Task<IEnumerable<HabitRecordResponseDto>> GetAllByDate(DateOnly date)
    {
        var habitRecords = await _habitRecordRepository.GetAllByDate(date);

        return habitRecords.Select(hr => _habitRecordConverter.ToResponseDto(hr)).ToList();
    }

    public async Task<IEnumerable<HabitRecordResponseDto>> GetAllByHabitId(long habitId)
    {
        ValidateId(habitId);

        var habitRecords = await _habitRecordRepository.GetAllByHabitId(habitId);

        return habitRecords.Select(hr => _habitRecordConverter.ToResponseDto(hr)).ToList();
    }

    public async Task<HabitRecordResponseDto> GetById(long id)
    {
        var habitRecord = await GetHabitRecordById(id);

        return _habitRecordConverter.ToResponseDto(habitRecord);
    }

    public async Task<HabitRecordResponseDto> GetRecordByHabitIdAndDate(long habitId, DateOnly date)
    {
        ValidateId(habitId);

        var habitRecord = await _habitRecordRepository.GetRecordByHabitIdAndDate(habitId, date);

        if(habitRecord == null)
        {
            throw new HabitRecordNotFoundException();
        }

        return _habitRecordConverter.ToResponseDto(habitRecord);
    }

    public async Task<HabitRecordResponseDto> Update(long id, HabitRecordUpdateRequestDto habitRecordUpdateRequestDto)
    {
        var habitRecord = await GetHabitRecordById(id);

        var habitRecordVerification = await _habitRecordRepository.GetRecordByHabitIdAndDate(habitRecord.HabitId, habitRecordUpdateRequestDto.RecordDate);

        if(habitRecordVerification != null && (habitRecordVerification.Id != habitRecord.Id))        
        {
            throw new HabitRecordAlreadyExistsException();
        }

        habitRecord.Update(
            habitRecordUpdateRequestDto.HabitState,
            habitRecordUpdateRequestDto.RecordDate,
            habitRecordUpdateRequestDto.Description
        );

        await _habitRecordRepository.Update(habitRecord);

        await _unitOfWork.SaveChangesAsync();

        return _habitRecordConverter.ToResponseDto(habitRecord);
    }

    private async Task<HabitRecord> GetHabitRecordById(long id)
    {
        if(id <= 0)
        {
            throw new ArgumentException("Id must be positive.");
        }

        var habitRecord = await _habitRecordRepository.GetById(id);

        if(habitRecord == null)
        {
            throw new HabitRecordNotFoundException();
        }

        return habitRecord;
    }

    private void ValidateId(long id)
    {
        if(id <= 0)
        {
            throw new ArgumentException("Id must be positive.");
        }
    }
}