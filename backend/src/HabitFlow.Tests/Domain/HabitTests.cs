using Xunit;
using HabitFlow.Domain;

public class HabitTests
{
    [Fact]
    public void Constructor_WithValidParameters_ShouldInitializeCorrectly()
    {
        var name = "  Workout  ";
        var duration = TimeSpan.FromMinutes(45);
        var priority = HabitPriority.High;
        var startDate = new DateOnly(2026, 10, 18);
        var endDate = new DateOnly(2026, 10, 25);
        var description = "  Morning workout routine.  ";

        var habit = new Habit(name, duration, priority, startDate, endDate, description);

        Assert.Equal("Workout", habit.Name);
        Assert.Equal(duration, habit.Duration);
        Assert.Equal(priority, habit.HabitPriority);
        Assert.Equal(startDate, habit.StartDate);
        Assert.Equal(endDate, habit.EndDate);
        Assert.Equal("Morning workout routine.", habit.Description);
        Assert.True(habit.CreatedAt <= DateTime.UtcNow);
    }

    [Fact]
    public void Constructor_WithNullName_ShouldThrowArgumentNullException()
    {
        Assert.Throws<ArgumentNullException>(() => 
            new Habit(null!, null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("\t")]
    public void Constructor_WithEmptyOrWhitespaceName_ShouldThrowArgumentException(string invalidName)
    {
        Assert.Throws<ArgumentException>(() => 
            new Habit(invalidName, null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null));
    }

    [Fact]
    public void Constructor_WithTooLongName_ShouldThrowArgumentException()
    {
        var longName = new string('A', 101);

        Assert.Throws<ArgumentException>(() => 
            new Habit(longName, null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Constructor_WithZeroOrNegativeDuration_ShouldThrowArgumentOutOfRangeException(long ticks)
    {
        var invalidDuration = TimeSpan.FromTicks(ticks);

        Assert.Throws<ArgumentOutOfRangeException>(() => 
            new Habit("Reading", invalidDuration, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null));
    }

    [Fact]
    public void Constructor_WithInvalidPriority_ShouldThrowArgumentOutOfRangeException()
    {
        var invalidPriority = (HabitPriority)999;

        Assert.Throws<ArgumentOutOfRangeException>(() => 
            new Habit("Reading", null, invalidPriority, new DateOnly(2026, 10, 18), null, null));
    }

    [Fact]
    public void Constructor_WithEndDateBeforeStartDate_ShouldThrowArgumentException()
    {
        var startDate = new DateOnly(2026, 10, 20);
        var endDate = new DateOnly(2026, 10, 18);

        Assert.Throws<ArgumentException>(() => 
            new Habit("Reading", null, HabitPriority.Medium, startDate, endDate, null));
    }

    [Fact]
    public void Constructor_WithTooLongDescription_ShouldThrowArgumentException()
    {
        var longDescription = new string('A', 501);

        Assert.Throws<ArgumentException>(() => 
            new Habit("Reading", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, longDescription));
    }

    [Fact]
    public void ChangeName_WithValidName_ShouldUpdateAndTrim()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);

        habit.ChangeName("  Updated Habit  ");

        Assert.Equal("Updated Habit", habit.Name);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void ChangeName_WithInvalidName_ShouldThrowException(string? invalidName)
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);

        Assert.ThrowsAny<ArgumentException>(() => habit.ChangeName(invalidName!));
    }

    [Fact]
    public void ChangeDescription_WithValidDescription_ShouldUpdateAndTrim()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);

        habit.ChangeDescription("  New Description  ");

        Assert.Equal("New Description", habit.Description);
    }

    [Fact]
    public void ChangeDescription_WithNull_ShouldSetToNull()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, "Desc");

        habit.ChangeDescription(null);

        Assert.Null(habit.Description);
    }

    [Fact]
    public void ChangeDescription_WithTooLongDescription_ShouldThrowArgumentException()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);
        var longDescription = new string('A', 501);

        Assert.Throws<ArgumentException>(() => habit.ChangeDescription(longDescription));
    }

    [Fact]
    public void ChangeEndDate_WithValidDate_ShouldUpdateEndDate()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);
        var newEndDate = new DateOnly(2026, 10, 25);

        habit.ChangeEndDate(newEndDate);

        Assert.Equal(newEndDate, habit.EndDate);
    }

    [Fact]
    public void ChangeEndDate_WithNull_ShouldSetEndDateToNull()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), new DateOnly(2026, 10, 25), null);

        habit.ChangeEndDate(null);

        Assert.Null(habit.EndDate);
    }

    [Fact]
    public void ChangeEndDate_BeforeStartDate_ShouldThrowArgumentException()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);
        var invalidEndDate = new DateOnly(2026, 10, 17);

        Assert.Throws<ArgumentException>(() => habit.ChangeEndDate(invalidEndDate));
    }

    [Fact]
    public void ChangeStartDate_WithValidDate_ShouldUpdateStartDate()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), new DateOnly(2026, 10, 25), null);
        var newStartDate = new DateOnly(2026, 10, 20);

        habit.ChangeStartDate(newStartDate);

        Assert.Equal(newStartDate, habit.StartDate);
    }

    [Fact]
    public void ChangeStartDate_AfterEndDate_ShouldThrowArgumentException()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), new DateOnly(2026, 10, 25), null);
        var invalidStartDate = new DateOnly(2026, 10, 26);

        Assert.Throws<ArgumentException>(() => habit.ChangeStartDate(invalidStartDate));
    }

    [Fact]
    public void ChangeHabitPriority_WithValidPriority_ShouldUpdatePriority()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);

        habit.ChangeHabitPriority(HabitPriority.Urgent);

        Assert.Equal(HabitPriority.Urgent, habit.HabitPriority);
    }

    [Fact]
    public void ChangeHabitPriority_WithInvalidPriority_ShouldThrowArgumentOutOfRangeException()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);

        Assert.Throws<ArgumentOutOfRangeException>(() => habit.ChangeHabitPriority((HabitPriority)999));
    }

    [Fact]
    public void ChangeDuration_WithValidDuration_ShouldUpdateDuration()
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);
        var newDuration = TimeSpan.FromHours(2);

        habit.ChangeDuration(newDuration);

        Assert.Equal(newDuration, habit.Duration);
    }

    [Fact]
    public void ChangeDuration_WithNull_ShouldSetDurationToNull()
    {
        var habit = new Habit("Initial", TimeSpan.FromHours(1), HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);

        habit.ChangeDuration(null);

        Assert.Null(habit.Duration);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void ChangeDuration_WithZeroOrNegativeDuration_ShouldThrowArgumentOutOfRangeException(long ticks)
    {
        var habit = new Habit("Initial", null, HabitPriority.Medium, new DateOnly(2026, 10, 18), null, null);
        var invalidDuration = TimeSpan.FromTicks(ticks);

        Assert.Throws<ArgumentOutOfRangeException>(() => habit.ChangeDuration(invalidDuration));
    }
}