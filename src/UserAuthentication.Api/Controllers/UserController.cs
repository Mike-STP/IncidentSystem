using UserAuthentication.Api.Models;
using UserAuthentication.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace UserAuthentication.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly UserService userService;

    public UserController(UserService userService)
    {
        this.userService = userService;
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
    public IActionResult Create(User user)
    {
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
}