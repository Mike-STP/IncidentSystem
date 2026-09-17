using UserAuthentication.Api.Models;
using UserAuthentication.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace UserAuthentication.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly UserService userService;
    private readonly SessionService sessionService;

    public UserController(
        UserService userService,
        SessionService sessionService)
    {
        this.userService = userService;
        this.sessionService = sessionService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(userService.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        User? user = userService.GetById(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost]
    public IActionResult Create(User user, [FromHeader(Name = "X-Session-Id")] string sessionId)
    {
        if (!sessionService.IsAdmin(sessionId))
        {
            return StatusCode(403, "Only admins can create new users.");
        }

        User createdUser = userService.Create(user);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdUser.Id },
            createdUser);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, User user)
    {
        User? updatedUser = userService.Update(id, user);

        if (updatedUser == null)
        {
            return NotFound();
        }

        return Ok(updatedUser);
    }

    [HttpPut("{id}/status")]
    public IActionResult ChangeStatus(
    int id,
    bool isActive)
    {
    string? sessionId = Request.Headers["X-Session-Id"].FirstOrDefault();
    
        if (!sessionService.IsAdmin(sessionId))
        {
            return StatusCode(403);
        }

        User? user = userService.ChangeStatus(id, isActive);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        User? user = userService.Login(
            request.Username,
            request.Password);

        if (user == null)
        {
            return Unauthorized();
        }

        string sessionId = sessionService.CreateSession(
            user.Id,
            user.Username,
            user.Role.ToString());

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.Role,
            sessionId
        });
    }
}
