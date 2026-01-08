using AcityChallenge.Application.Common.Interfaces;
using AcityChallenge.Application.Usuarios.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Usuarios.Queries.GetUsuarioPerfil;

// La Query recibe el Email extraído del Token
public record GetUsuarioPerfilQuery(string Email) : IRequest<UsuarioPerfilResponse>;

public class GetUsuarioPerfilQueryHandler : IRequestHandler<GetUsuarioPerfilQuery, UsuarioPerfilResponse>
{
    private readonly IApplicationDbContext _context;

    public GetUsuarioPerfilQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UsuarioPerfilResponse> Handle(GetUsuarioPerfilQuery request, CancellationToken cancellationToken)
    {
        var usuario = await _context.Usuarios
            .Where(u => u.Email == request.Email)
            .Select(u => new UsuarioPerfilResponse(u.Nombre, u.Email, u.FechaCreacion))
            .FirstOrDefaultAsync(cancellationToken);

        if (usuario == null) throw new Exception("Usuario no encontrado.");

        return usuario;
    }
}