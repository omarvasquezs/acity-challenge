using AcityChallenge.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Usuarios.Commands.ActualizarUsuario;

public record ActualizarUsuarioCommand(
    Guid Id,
    string Nombre,
    string Email,
    string Rol,
    string? Password) : IRequest<bool>;

public class ActualizarUsuarioCommandHandler : IRequestHandler<ActualizarUsuarioCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ActualizarUsuarioCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ActualizarUsuarioCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (usuario == null) return false;

        // Actualización de campos básicos
        usuario.Nombre = request.Nombre;
        usuario.Email = request.Email;
        usuario.Rol = request.Rol;

        // Si se envió un password, se encripta (BCrypt es lo ideal)
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}