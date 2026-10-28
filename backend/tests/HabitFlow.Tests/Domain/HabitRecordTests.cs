using HabitFlow.Domain;
using Xunit;

namespace HabitFlow.Tests;

public class HabitRecordTests
{
    [Fact]
    public void CreateHabitRecord_WithValidData_shouldCreateHabitRecord()
    {
        var date = new DateOnly(2026, 10, 17);

        var result = new HabitRecord(1, HabitState.Completed, date, null);

        Assert.Equal(1, result.HabitId);
        Assert.Equal(HabitState.Completed, result.HabitState);
        Assert.Equal(new DateOnly(2026, 10, 17), result.RecordDate);
        Assert.Null(result.Description);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void CreateHabitRecord_WithInvalidHabitId_shouldThrowException(long input)
    {
        var date = new DateOnly(2026, 10, 17);

        var result = Assert.Throws<ArgumentException>(() => new HabitRecord(input, HabitState.Completed, date, null));

        Assert.Equal("Id must be positive.", result.Message);
    }

    [Theory]
    [InlineData(-5)]
    [InlineData(50)]
    public void CreateHabitRecord_WithInvalidHabitState_shouldThrowException(int input)
    {
        var date = new DateOnly(2026, 10, 17);

        var result = Assert.Throws<ArgumentOutOfRangeException>(() => new HabitRecord(1, (HabitState)input, date, null));

        Assert.Equal("habitState", result.ParamName);
    }


    [Fact]
    public void CreateHabitRecord_WithInvalidDate_shouldThrowException()
    {
        var date = new DateOnly(2500, 10, 17);

        var result = Assert.Throws<ArgumentException>(() => new HabitRecord(1, HabitState.Completed, date, null));

        Assert.Equal("Record date cannot be in the future.", result.Message);
    }

    [Fact]
    public void CreateHabitRecord_WithInvalidDescription_shouldThrowException()
    {
        var date = new DateOnly(2026, 10, 17);

        var description = new string('a', 501);

        var result = Assert.Throws<ArgumentException>(() => new HabitRecord(1, HabitState.Completed, date, description));

        Assert.Equal("Description cannot be longer than 500 characters.", result.Message);
    }

    [Theory]
    [InlineData(HabitState.Completed)]
    [InlineData(HabitState.NotCompleted)]
    [InlineData(HabitState.Pending)]
    public void ChangeHabitState_WithValidData_shouldChangeHabitState(HabitState input)
    {
        var date = new DateOnly(2026, 10, 17);

        var result = new HabitRecord(1, HabitState.Completed, date, null);

        Assert.Equal(HabitState.Completed, result.HabitState);

        result.ChangeHabitState(input);

        Assert.Equal(1, result.HabitId);
        Assert.Equal(input, result.HabitState);
        Assert.Equal(new DateOnly(2026, 10, 17), result.RecordDate);
        Assert.Null(result.Description);
    }

    [Theory]
    [InlineData(-5)]
    [InlineData(50)]
    public void ChangeHabitState_WithInvalidHabitState_shouldThrowException(int input)
    {
        var date = new DateOnly(2026, 10, 17);

        var habitRecord = new HabitRecord(1, HabitState.Pending, date, null);

        Assert.Equal(HabitState.Pending, habitRecord.HabitState);

        var result = Assert.Throws<ArgumentOutOfRangeException>(() => habitRecord.ChangeHabitState((HabitState)input));

        Assert.Equal("habitState", result.ParamName);
        Assert.Equal(1, habitRecord.HabitId);
        Assert.Equal(HabitState.Pending, habitRecord.HabitState);
        Assert.Equal(new DateOnly(2026, 10, 17), habitRecord.RecordDate);
        Assert.Null(habitRecord.Description);
    }

    [Fact]
    public void ChangeRecordDate_WithValidData_shouldChangeRecordDate()
    {
        var date = new DateOnly(2026, 10, 17);

        var result = new HabitRecord(1, HabitState.Completed, date, null);

        Assert.Equal(new DateOnly(2026, 10, 17), result.RecordDate);

        result.ChangeRecordDate(new DateOnly(2025, 10, 20));

        Assert.Equal(1, result.HabitId);
        Assert.Equal(HabitState.Completed, result.HabitState);
        Assert.Equal(new DateOnly(2025, 10, 20), result.RecordDate);
        Assert.Null(result.Description);
    }

    [Fact]
    public void ChangeRecordDate_WithInvalidData_shouldThrowException()
    {
        var date = new DateOnly(2026, 10, 17);

        var habitRecord = new HabitRecord(1, HabitState.Completed, date, null);

        Assert.Equal(new DateOnly(2026, 10, 17), habitRecord.RecordDate);

        var result = Assert.Throws<ArgumentException>(() => habitRecord.ChangeRecordDate(new DateOnly(2500, 10, 20)));

        Assert.Equal("Record date cannot be in the future.", result.Message);
        Assert.Equal(1, habitRecord.HabitId);
        Assert.Equal(HabitState.Completed, habitRecord.HabitState);
        Assert.Equal(new DateOnly(2026, 10, 17), habitRecord.RecordDate);
        Assert.Null(habitRecord.Description);
    }

    [Theory]
    [InlineData("Test")]
    [InlineData(null)]
    public void ChangeDescription_WithValidData_shouldChangeDescription(string input)
    {
        var date = new DateOnly(2026, 10, 17);

        var result = new HabitRecord(1, HabitState.Completed, date, null);

        Assert.Null(result.Description);

        result.ChangeDescription(input);

        Assert.Equal(1, result.HabitId);
        Assert.Equal(HabitState.Completed, result.HabitState);
        Assert.Equal(new DateOnly(2026, 10, 17), result.RecordDate);
        Assert.Equal(input, result.Description);
    }

    [Fact]
    public void ChangeDescription_WithInvalidData_shouldThrowException()
    {
        var date = new DateOnly(2026, 10, 17);

        var habitRecord = new HabitRecord(1, HabitState.Completed, date, null);

        Assert.Null(habitRecord.Description);

        var result = Assert.Throws<ArgumentException>(() => habitRecord.ChangeDescription(new string('a', 501)));

        Assert.Equal(1, habitRecord.HabitId);
        Assert.Equal(HabitState.Completed, habitRecord.HabitState);
        Assert.Equal(new DateOnly(2026, 10, 17), habitRecord.RecordDate);
        Assert.Null(habitRecord.Description);
        Assert.Equal("Description cannot be longer than 500 characters.", result.Message);
    }
}