using AcityChallenge.Application.Usuarios.Commands.Login;
using AcityChallenge.Application.Usuarios.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AcityChallenge.Api.Controllers;

[ApiController]
[Route("auth")] // Esto establece la base como /auth
public class AuthController : ControllerBase
{
    private readonly ISender _mediator;

    public AuthController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")] // Esto completa la ruta como /auth/login
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginCommand command)
    {
        // El mediador procesa la validación contra BD y generación de JWT
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}