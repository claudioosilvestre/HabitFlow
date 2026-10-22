using HabitFlow.Application.Dtos;
using HabitFlow.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HabitFlow.Api.Controllers;

[ApiController]
[Route("api/habit-records")]
public class HabitRecordController : ControllerBase
{
    private readonly IHabitRecordService _habitRecordService;

    public HabitRecordController(IHabitRecordService habitRecordService)
    {
        _habitRecordService = habitRecordService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HabitRecordResponseDto>>> GetAll()
    {
        return Ok(await _habitRecordService.GetAll());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HabitRecordResponseDto>> GetById([FromRoute] long id)
    {
        return Ok(await _habitRecordService.GetById(id));
    }

    [HttpGet("by-habit/{habitId}")]
    public async Task<ActionResult<HabitRecordResponseDto>> GetRecordByHabitIdAndDate([FromRoute] long habitId, [FromQuery] DateOnly date)
    {
        return Ok(await _habitRecordService.GetRecordByHabitIdAndDate(habitId, date));
    }

    [HttpGet("by-habit/all/{habitId}")]
    public async Task<ActionResult<IEnumerable<HabitRecordResponseDto>>> GetAllByHabitId([FromRoute] long habitId)
    {
        return Ok(await _habitRecordService.GetAllByHabitId(habitId));
    }

    [HttpGet("by-date")]
    public async Task<ActionResult<IEnumerable<HabitRecordResponseDto>>> GetAllByDate([FromQuery] DateOnly date)
    {
        return Ok(await _habitRecordService.GetAllByDate(date));
    }

    [HttpPost]
    public async Task<ActionResult<HabitRecordResponseDto>> Create([FromBody] HabitRecordCreateRequestDto habitRecordCreateRequestDto)
    {
        var habitRecord = await _habitRecordService.Create(habitRecordCreateRequestDto);

        return CreatedAtAction(nameof(GetById), new{id = habitRecord.Id}, habitRecord);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<HabitRecordResponseDto>> Update([FromRoute] long id, [FromBody] HabitRecordUpdateRequestDto habitRecordUpdateRequestDto)
    {
        return Ok(await _habitRecordService.Update(id, habitRecordUpdateRequestDto));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] long id)
    {
        await _habitRecordService.DeleteById(id);

        return NoContent();
    }
}