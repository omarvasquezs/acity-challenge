using System.Security.Claims;
using AcityChallenge.Application.Usuarios.Commands.Login;
using Microsoft.AspNetCore.RateLimiting;
using AcityChallenge.Application.Usuarios.Commands.RegistrarUsuario;
using AcityChallenge.Application.Usuarios.Commands.ActualizarUsuario;
using AcityChallenge.Application.Usuarios.Common;
using AcityChallenge.Application.Usuarios.Queries.GetUsuarioPerfil;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AcityChallenge.Application.Usuarios.Queries.GetUsuarios;
using AcityChallenge.Application.Usuarios.Commands.EliminarUsuario;

namespace AcityChallenge.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("fixed")]
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

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<bool>> Actualizar(Guid id, [FromBody] ActualizarUsuarioCommand command)
    {
        // Validación de seguridad: el ID de la URL debe coincidir con el del comando
        if (id != command.Id) return BadRequest("El ID del usuario no coincide.");

        var result = await _mediator.Send(command);
        return result ? Ok(result) : NotFound();
    }

    [Authorize]
    [HttpGet("perfil")]
    public async Task<ActionResult<UsuarioPerfilResponse>> GetPerfil()
    {
        var email = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(email)) return Unauthorized();

        var result = await _mediator.Send(new GetUsuarioPerfilQuery(email));
        return Ok(result);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<UsuarioPerfilResponse>>> Get()
    {
        return Ok(await _mediator.Send(new GetUsuariosQuery()));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> Eliminar(Guid id)
    {
        var result = await _mediator.Send(new EliminarUsuarioCommand(id));
        return result ? Ok(result) : NotFound();
    }
}