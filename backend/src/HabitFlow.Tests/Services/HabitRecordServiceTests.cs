using Xunit;
using Moq;
using HabitFlow.Application.Services;
using HabitFlow.Application.Interfaces;
using HabitFlow.Application.Dtos;
using HabitFlow.Application.Converters;
using HabitFlow.Application.Exceptions;
using HabitFlow.Domain;

namespace HabitFlow.Application.Tests;

public class HabitRecordServiceTests
{
    private readonly Mock<IHabitRecordRepository> _habitRecordRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IHabitRecordConverter> _habitRecordConverterMock;
    private readonly Mock<IHabitRepository> _habitRepositoryMock;
    private readonly HabitRecordService _service;

    public HabitRecordServiceTests()
    {
        _habitRecordRepositoryMock = new Mock<IHabitRecordRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _habitRecordConverterMock = new Mock<IHabitRecordConverter>();
        _habitRepositoryMock = new Mock<IHabitRepository>();

        _service = new HabitRecordService(
            _habitRecordRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _habitRecordConverterMock.Object,
            _habitRepositoryMock.Object
        );
    }

    [Fact]
    public async Task Create_WhenHabitNotFound_ThrowsHabitNotFoundException()
    {
        var request = new HabitRecordCreateRequestDto();
        request.HabitId = 1;
        request.HabitState = HabitState.Completed; 
        request.RecordDate = DateOnly.FromDateTime(DateTime.UtcNow);
        request.Description =  "Test";
        _habitRepositoryMock.Setup(x => x.GetById(request.HabitId)).ReturnsAsync((Habit)null!);

        await Assert.ThrowsAsync<HabitNotFoundException>(() => _service.Create(request));
    }

    [Fact]
    public async Task Create_WhenRecordAlreadyExists_ThrowsHabitRecordAlreadyExistsException()
    {
        var request = new HabitRecordCreateRequestDto();
        request.HabitId = 1;
        request.HabitState = HabitState.Completed; 
        request.RecordDate = DateOnly.FromDateTime(DateTime.UtcNow);
        request.Description =  "Test";

        var habit = new Habit("Test Habit", TimeSpan.FromMinutes(30), HabitPriority.High, DateOnly.FromDateTime(DateTime.UtcNow), null, null);
        
        _habitRepositoryMock.Setup(x => x.GetById(request.HabitId)).ReturnsAsync(habit);
        _habitRecordRepositoryMock.Setup(x => x.GetRecordByHabitIdAndDate(request.HabitId, request.RecordDate))
            .ReturnsAsync(new HabitRecord(request.HabitId, request.HabitState, request.RecordDate, request.Description));

        await Assert.ThrowsAsync<HabitRecordAlreadyExistsException>(() => _service.Create(request));
    }

    [Fact]
    public async Task Create_WhenValidRequest_CreatesAndReturnsResponseDto()
    {
        var request = new HabitRecordCreateRequestDto();
        request.HabitId = 1;
        request.HabitState = HabitState.Completed; 
        request.RecordDate = DateOnly.FromDateTime(DateTime.UtcNow);
        request.Description =  "Test";

        var habit = new Habit("Test Habit", TimeSpan.FromMinutes(30), HabitPriority.High, DateOnly.FromDateTime(DateTime.UtcNow), null, null);
        
        var expectedDto = new HabitRecordResponseDto();
        expectedDto.Id = 1;
        expectedDto.HabitId = 1;
        expectedDto.HabitState = HabitState.Completed;
        expectedDto.RecordDate = request.RecordDate;
        expectedDto.Description = "Test";

        _habitRepositoryMock.Setup(x => x.GetById(request.HabitId)).ReturnsAsync(habit);
        _habitRecordRepositoryMock.Setup(x => x.GetRecordByHabitIdAndDate(request.HabitId, request.RecordDate))
            .ReturnsAsync((HabitRecord)null!);
        _habitRecordConverterMock.Setup(x => x.ToResponseDto(It.IsAny<HabitRecord>())).Returns(expectedDto);

        var result = await _service.Create(request);

        Assert.NotNull(result);
        _habitRecordRepositoryMock.Verify(x => x.Create(It.IsAny<HabitRecord>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteById_WhenIdIsInvalid_ThrowsArgumentException()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _service.DeleteById(0));
    }

    [Fact]
    public async Task DeleteById_WhenRecordNotFound_ThrowsHabitRecordNotFoundException()
    {
        _habitRecordRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync((HabitRecord)null!);

        await Assert.ThrowsAsync<HabitRecordNotFoundException>(() => _service.DeleteById(1));
    }

    [Fact]
    public async Task DeleteById_WhenValidId_DeletesRecord()
    {
        var record = new HabitRecord(1, HabitState.Completed, DateOnly.FromDateTime(DateTime.UtcNow), "Test");
        _habitRecordRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync(record);

        await _service.DeleteById(1);

        _habitRecordRepositoryMock.Verify(x => x.DeleteById(1), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetAll_ReturnsAllRecords()
    {
        var records = new List<HabitRecord>
        {
            new HabitRecord(1, HabitState.Completed, DateOnly.FromDateTime(DateTime.UtcNow), "Test 1")
        };

        var habitRecord = new HabitRecordResponseDto();
        habitRecord.Id = 1;
        habitRecord.HabitId = 1;
        habitRecord.HabitState = HabitState.Completed;
        habitRecord.RecordDate = DateOnly.FromDateTime(DateTime.UtcNow);
        habitRecord.Description = "Test 1";

        _habitRecordRepositoryMock.Setup(x => x.GetAll()).ReturnsAsync(records);
        _habitRecordConverterMock.Setup(x => x.ToResponseDto(It.IsAny<HabitRecord>()))
            .Returns(habitRecord);

        var result = await _service.GetAll();

        Assert.NotNull(result);
        Assert.Single(result);
    }

    [Fact]
    public async Task GetAllByDate_ReturnsMatchingRecords()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow);
        var records = new List<HabitRecord>
        {
            new HabitRecord(1, HabitState.Completed, date, "Test")
        };

        var habitRecord = new HabitRecordResponseDto();
        habitRecord.Id = 1;
        habitRecord.HabitId = 1;
        habitRecord.HabitState = HabitState.Completed;
        habitRecord.RecordDate = date;
        habitRecord.Description = "Test";

        _habitRecordRepositoryMock.Setup(x => x.GetAllByDate(date)).ReturnsAsync(records);
        _habitRecordConverterMock.Setup(x => x.ToResponseDto(It.IsAny<HabitRecord>()))
            .Returns(habitRecord);

        var result = await _service.GetAllByDate(date);

        Assert.NotNull(result);
        Assert.Single(result);
    }

    [Fact]
    public async Task GetAllByHabitId_WhenIdIsInvalid_ThrowsArgumentException()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _service.GetAllByHabitId(0));
    }

    [Fact]
    public async Task GetAllByHabitId_WhenValidId_ReturnsRecords()
    {
        var records = new List<HabitRecord>
        {
            new HabitRecord(1, HabitState.Completed, DateOnly.FromDateTime(DateTime.UtcNow), "Test")
        };

        var habitRecord = new HabitRecordResponseDto();
        habitRecord.Id = 1;
        habitRecord.HabitId = 1;
        habitRecord.HabitState = HabitState.Completed;
        habitRecord.RecordDate = DateOnly.FromDateTime(DateTime.UtcNow);
        habitRecord.Description = "Test";

        _habitRecordRepositoryMock.Setup(x => x.GetAllByHabitId(1)).ReturnsAsync(records);
        _habitRecordConverterMock.Setup(x => x.ToResponseDto(It.IsAny<HabitRecord>()))
            .Returns(habitRecord);

        var result = await _service.GetAllByHabitId(1);

        Assert.NotNull(result);
        Assert.Single(result);
    }

    [Fact]
    public async Task GetById_WhenRecordNotFound_ThrowsHabitRecordNotFoundException()
    {
        _habitRecordRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync((HabitRecord)null!);

        await Assert.ThrowsAsync<HabitRecordNotFoundException>(() => _service.GetById(1));
    }

    [Fact]
    public async Task GetById_WhenIdIsInvalid_ThrowsArgumentException()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _service.GetById(0));
    }

    [Fact]
    public async Task GetById_WhenValidId_ReturnsResponseDto()
    {
        var record = new HabitRecord(1, HabitState.Completed, DateOnly.FromDateTime(DateTime.UtcNow), "Test");

        var habitRecord = new HabitRecordResponseDto();
        habitRecord.Id = 1;
        habitRecord.HabitId = 1;
        habitRecord.HabitState = HabitState.Completed;
        habitRecord.RecordDate = record.RecordDate;
        habitRecord.Description = "Test";

        _habitRecordRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync(record);
        _habitRecordConverterMock.Setup(x => x.ToResponseDto(record))
            .Returns(habitRecord);

        var result = await _service.GetById(1);

        Assert.NotNull(result);
    }

    [Fact]
    public async Task GetRecordByHabitIdAndDate_WhenIdIsInvalid_ThrowsArgumentException()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _service.GetRecordByHabitIdAndDate(0, DateOnly.FromDateTime(DateTime.UtcNow)));
    }

    [Fact]
    public async Task GetRecordByHabitIdAndDate_WhenNotFound_ThrowsHabitRecordNotFoundException()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow);
        _habitRecordRepositoryMock.Setup(x => x.GetRecordByHabitIdAndDate(1, date)).ReturnsAsync((HabitRecord)null!);

        await Assert.ThrowsAsync<HabitRecordNotFoundException>(() => _service.GetRecordByHabitIdAndDate(1, date));
    }

    [Fact]
    public async Task GetRecordByHabitIdAndDate_WhenFound_ReturnsResponseDto()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow);
        var record = new HabitRecord(1, HabitState.Completed, date, "Test");

        var habitRecord = new HabitRecordResponseDto();
        habitRecord.Id = 1;
        habitRecord.HabitId = 1;
        habitRecord.HabitState = HabitState.Completed;
        habitRecord.RecordDate = date;
        habitRecord.Description = "Test";

        _habitRecordRepositoryMock.Setup(x => x.GetRecordByHabitIdAndDate(1, date)).ReturnsAsync(record);
        _habitRecordConverterMock.Setup(x => x.ToResponseDto(record))
            .Returns(habitRecord);

        var result = await _service.GetRecordByHabitIdAndDate(1, date);

        Assert.NotNull(result);
    }

    [Fact]
    public async Task Update_WhenRecordNotFound_ThrowsHabitRecordNotFoundException()
    {
        var request = new HabitRecordUpdateRequestDto();
        request.HabitState = HabitState.Completed;
        request.RecordDate = DateOnly.FromDateTime(DateTime.UtcNow);
        request.Description = "Test";

        _habitRecordRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync((HabitRecord)null!);

        await Assert.ThrowsAsync<HabitRecordNotFoundException>(() => _service.Update(1, request));
    }
    [Fact]
    public async Task Update_WhenIdIsInvalid_ThrowsArgumentException()
    {
        var request = new HabitRecordUpdateRequestDto();
        request.HabitState = HabitState.Completed;
        request.RecordDate = DateOnly.FromDateTime(DateTime.UtcNow);
        request.Description = "Test";

        await Assert.ThrowsAsync<ArgumentException>(() => _service.Update(0, request));
    }

    [Fact]
    public async Task Update_WhenVerificationFails_ThrowsHabitRecordAlreadyExistsException()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow);

        var request = new HabitRecordUpdateRequestDto();
        request.HabitState = HabitState.Completed;
        request.RecordDate = date;
        request.Description = "Test";

        var existingRecord = new HabitRecord(1, HabitState.NotCompleted, date, "Old");
        
        var conflictingRecord = new HabitRecord(1, HabitState.Completed, date, "Conflict");
        
        typeof(HabitRecord).GetProperty("Id")?.SetValue(conflictingRecord, 2L);

        _habitRecordRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync(existingRecord);
        _habitRecordRepositoryMock.Setup(x => x.GetRecordByHabitIdAndDate(existingRecord.HabitId, date))
            .ReturnsAsync(conflictingRecord);

        await Assert.ThrowsAsync<HabitRecordAlreadyExistsException>(() => _service.Update(1, request));
    }

    [Fact]
    public async Task Update_WhenValidRequest_UpdatesAndReturnsResponseDto()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow);

        var request = new HabitRecordUpdateRequestDto();
        request.HabitState = HabitState.Completed;
        request.RecordDate = date;
        request.Description = "Updated";

        var existingRecord = new HabitRecord(1, HabitState.NotCompleted, date, "Old");

        _habitRecordRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync(existingRecord);
        _habitRecordRepositoryMock.Setup(x => x.GetRecordByHabitIdAndDate(existingRecord.HabitId, date))
            .ReturnsAsync((HabitRecord)null!);

        var habitRecordResponse = new HabitRecordResponseDto();
        habitRecordResponse.Id = 1;
        habitRecordResponse.HabitId = 1;
        habitRecordResponse.HabitState = HabitState.Completed;
        habitRecordResponse.RecordDate = date;
        habitRecordResponse.Description = "Updated";

        _habitRecordConverterMock.Setup(x => x.ToResponseDto(It.IsAny<HabitRecord>()))
            .Returns(habitRecordResponse);

        var result = await _service.Update(1, request);

        Assert.NotNull(result);
        _habitRecordRepositoryMock.Verify(x => x.Update(It.IsAny<HabitRecord>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }
}