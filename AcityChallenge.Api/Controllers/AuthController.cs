using AcityChallenge.Application.Usuarios.Commands.Login;
using AcityChallenge.Application.Usuarios.Commands.Logout;
using AcityChallenge.Application.Usuarios.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AcityChallenge.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ISender _mediator;

    public AuthController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize] // Atributo ahora reconocido
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var email = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(email)) return Unauthorized();

        var result = await _mediator.Send(new LogoutCommand(email));
        return result ? Ok(new { mensaje = "Sesión cerrada exitosamente." }) : BadRequest();
    }
}