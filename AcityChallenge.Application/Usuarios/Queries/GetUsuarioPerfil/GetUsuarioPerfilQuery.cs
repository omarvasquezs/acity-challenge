using AcityChallenge.Application.Common.Interfaces;
using AcityChallenge.Application.Usuarios.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Usuarios.Queries.GetUsuarioPerfil;

// Se agrega '?' para indicar que el resultado puede ser nulo
public record GetUsuarioPerfilQuery(string Email) : IRequest<UsuarioPerfilResponse?>;

public class GetUsuarioPerfilQueryHandler : IRequestHandler<GetUsuarioPerfilQuery, UsuarioPerfilResponse?>
{
    private readonly IApplicationDbContext _context;

    public GetUsuarioPerfilQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UsuarioPerfilResponse?> Handle(GetUsuarioPerfilQuery request, CancellationToken cancellationToken)
    {
        // El método FirstOrDefaultAsync puede devolver null si el correo no existe
        var usuario = await _context.Usuarios
            .Where(u => u.Email == request.Email)
            .Select(u => new UsuarioPerfilResponse(
                u.Id,
                u.Nombre,
                u.Email,
                u.Rol,
                u.FechaCreacion
            ))
            .FirstOrDefaultAsync(cancellationToken);

        return usuario;
    }
}