using AcityChallenge.Application.Usuarios.Commands.RegistrarUsuario;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AcityChallenge.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly ISender _mediator;

    public UsuariosController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("registrar")]
    public async Task<ActionResult<Guid>> Registrar([FromBody] RegistrarUsuarioCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}