using System.Security.Claims;
using AcityChallenge.Application.Usuarios.Commands.Login;
using Microsoft.AspNetCore.RateLimiting;
using AcityChallenge.Application.Usuarios.Commands.RegistrarUsuario;
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
    [HttpGet("perfil")]
    public async Task<ActionResult<UsuarioPerfilResponse>> GetPerfil()
    {
        // Extraemos el email del claim 'sub' del Token JWT
        var email = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(email)) return Unauthorized();

        var result = await _mediator.Send(new GetUsuarioPerfilQuery(email));
        return Ok(result);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<UsuarioPerfilResponse>>> Get()
    {
        // Enviamos la Query al Mediator para obtener todos los usuarios
        return Ok(await _mediator.Send(new GetUsuariosQuery()));
    }

    [Authorize(Roles = "Admin")] // Solo administradores pueden borrar usuarios
    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> Eliminar(Guid id)
    {
        var result = await _mediator.Send(new EliminarUsuarioCommand(id));
        return result ? Ok(result) : NotFound();
    }
}