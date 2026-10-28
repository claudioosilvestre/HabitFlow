namespace HabitFlow.Tests.Services;

using Xunit;
using Moq;
using HabitFlow.Application.Services;
using HabitFlow.Application.Interfaces;
using HabitFlow.Application.Dtos;
using HabitFlow.Application.Exceptions;
using HabitFlow.Domain;

public class HabitServiceTests
{
    private readonly Mock<IHabitRepository> _habitRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IHabitConverter> _habitConverterMock;
    private readonly HabitService _service;

    public HabitServiceTests()
    {
        _habitRepositoryMock = new Mock<IHabitRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _habitConverterMock = new Mock<IHabitConverter>();

        _service = new HabitService(
            _habitRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _habitConverterMock.Object
        );
    }

    [Fact]
    public async Task Create_WhenValidRequest_CreatesAndReturnsResponseDto()
    {
        var request = new HabitCreateRequestDto();
        request.Name = "Test Habit";
        request.Duration = TimeSpan.FromMinutes(30);
        request.HabitPriority = HabitPriority.High;
        request.StartDate = DateOnly.FromDateTime(DateTime.UtcNow);
        request.EndDate = null;
        request.Description = "Test Description";

        var expectedDto = new HabitResponseDto();
        expectedDto.Id = 1;
        expectedDto.Name = request.Name;
        expectedDto.Duration = request.Duration;
        expectedDto.HabitPriority = request.HabitPriority;
        expectedDto.StartDate = request.StartDate;
        expectedDto.EndDate = request.EndDate;
        expectedDto.Description = request.Description;

        _habitConverterMock.Setup(x => x.ToResponseDto(It.IsAny<Habit>())).Returns(expectedDto);

        var result = await _service.Create(request);

        Assert.NotNull(result);
        _habitRepositoryMock.Verify(x => x.Create(It.IsAny<Habit>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteById_WhenIdIsInvalid_ThrowsArgumentOutOfRangeException()
    {
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _service.DeleteById(0));
    }

    [Fact]
    public async Task DeleteById_WhenHabitNotFound_ThrowsHabitNotFoundException()
    {
        _habitRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync((Habit)null!);

        await Assert.ThrowsAsync<HabitNotFoundException>(() => _service.DeleteById(1));
    }

    [Fact]
    public async Task DeleteById_WhenValidId_DeletesHabit()
    {
        var habit = new Habit("Test Habit", TimeSpan.FromMinutes(30), HabitPriority.High, DateOnly.FromDateTime(DateTime.UtcNow), null, null);
        _habitRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync(habit);

        await _service.DeleteById(1);

        _habitRepositoryMock.Verify(x => x.DeleteById(1), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetAll_ReturnsAllHabits()
    {
        var habits = new List<Habit>
        {
            new Habit("Test Habit", TimeSpan.FromMinutes(30), HabitPriority.High, DateOnly.FromDateTime(DateTime.UtcNow), null, null)
        };

        var habitResponseDto = new HabitResponseDto();
        habitResponseDto.Id = 1;
        habitResponseDto.Name = "Test Habit";

        _habitRepositoryMock.Setup(x => x.GetAll()).ReturnsAsync(habits);
        _habitConverterMock.Setup(x => x.ToResponseDto(It.IsAny<Habit>())).Returns(habitResponseDto);

        var result = await _service.GetAll();

        Assert.NotNull(result);
        Assert.Single(result);
    }

    [Fact]
    public async Task GetById_WhenIdIsInvalid_ThrowsArgumentOutOfRangeException()
    {
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _service.GetById(0));
    }

    [Fact]
    public async Task GetById_WhenHabitNotFound_ThrowsHabitNotFoundException()
    {
        _habitRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync((Habit)null!);

        await Assert.ThrowsAsync<HabitNotFoundException>(() => _service.GetById(1));
    }

    [Fact]
    public async Task GetById_WhenValidId_ReturnsResponseDto()
    {
        var habit = new Habit("Test Habit", TimeSpan.FromMinutes(30), HabitPriority.High, DateOnly.FromDateTime(DateTime.UtcNow), null, null);
        
        var habitResponseDto = new HabitResponseDto();
        habitResponseDto.Id = 1;
        habitResponseDto.Name = "Test Habit";

        _habitRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync(habit);
        _habitConverterMock.Setup(x => x.ToResponseDto(habit)).Returns(habitResponseDto);

        var result = await _service.GetById(1);

        Assert.NotNull(result);
    }

    [Fact]
    public async Task Update_WhenIdIsInvalid_ThrowsArgumentOutOfRangeException()
    {
        var request = new HabitUpdateRequestDto();
        request.Name = "Updated";
        request.Duration = TimeSpan.FromMinutes(30);
        request.HabitPriority = HabitPriority.High;
        request.StartDate = DateOnly.FromDateTime(DateTime.UtcNow);

        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _service.Update(0, request));
    }

    [Fact]
    public async Task Update_WhenHabitNotFound_ThrowsHabitNotFoundException()
    {
        var request = new HabitUpdateRequestDto();
        request.Name = "Updated";
        request.Duration = TimeSpan.FromMinutes(30);
        request.HabitPriority = HabitPriority.High;
        request.StartDate = DateOnly.FromDateTime(DateTime.UtcNow);

        _habitRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync((Habit)null!);

        await Assert.ThrowsAsync<HabitNotFoundException>(() => _service.Update(1, request));
    }

    [Fact]
    public async Task Update_WhenValidRequest_UpdatesAndReturnsResponseDto()
    {
        var request = new HabitUpdateRequestDto();
        request.Name = "Updated Habit";
        request.Duration = TimeSpan.FromMinutes(45);
        request.HabitPriority = HabitPriority.Medium;
        request.StartDate = DateOnly.FromDateTime(DateTime.UtcNow);
        request.EndDate = null;
        request.Description = "Updated Description";

        var existingHabit = new Habit("Old Habit", TimeSpan.FromMinutes(30), HabitPriority.High, DateOnly.FromDateTime(DateTime.UtcNow), null, null);

        var habitResponseDto = new HabitResponseDto();
        habitResponseDto.Id = 1;
        habitResponseDto.Name = request.Name;

        _habitRepositoryMock.Setup(x => x.GetById(1)).ReturnsAsync(existingHabit);
        _habitConverterMock.Setup(x => x.ToResponseDto(It.IsAny<Habit>())).Returns(habitResponseDto);

        var result = await _service.Update(1, request);

        Assert.NotNull(result);
        _habitRepositoryMock.Verify(x => x.Update(It.IsAny<Habit>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }
}