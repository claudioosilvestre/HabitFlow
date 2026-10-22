using HabitFlow.Application.Dtos;
using HabitFlow.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HabitFlow.Api.Controllers;

[ApiController]
[Route("api/habits")]
public class HabitController : ControllerBase
{
    private readonly IHabitService _habitService;

    public HabitController(IHabitService habitService)
    {
        _habitService = habitService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HabitResponseDto>>> GetAll()
    {
        return Ok(await _habitService.GetAll());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HabitResponseDto>> GetById([FromRoute] long id)
    {   
        return Ok(await _habitService.GetById(id));
    }

    [HttpPost]
    public async Task<ActionResult<HabitResponseDto>> Create([FromBody] HabitCreateRequestDto habitCreateRequestDto)
    {
        var habit = await _habitService.Create(habitCreateRequestDto);

        return CreatedAtAction(nameof(GetById), new{id = habit.Id}, habit);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<HabitResponseDto>> Update([FromRoute] long id, [FromBody] HabitUpdateRequestDto habitUpdateRequestDto)
    {
        return Ok(await _habitService.Update(id, habitUpdateRequestDto));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] long id)
    {
        await _habitService.DeleteById(id);

        return NoContent();
    }
}