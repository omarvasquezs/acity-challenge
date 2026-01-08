using AcityChallenge.Application.Common.Interfaces;
using AcityChallenge.Domain.Entities;
using MediatR;
using BCrypt.Net;

namespace AcityChallenge.Application.Usuarios.Commands.RegistrarUsuario;

// El Command: Lo que recibe la API
public record RegistrarUsuarioCommand(string Nombre, string Email, string Password) : IRequest<Guid>;

// El Handler: La lógica de negocio
public class RegistrarUsuarioCommandHandler : IRequestHandler<RegistrarUsuarioCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public RegistrarUsuarioCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(RegistrarUsuarioCommand request, CancellationToken cancellationToken)
    {
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            Nombre = request.Nombre,
            Email = request.Email,
            PasswordHash = passwordHash,
            FechaCreacion = DateTime.UtcNow
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync(cancellationToken);

        return usuario.Id;
    }
}