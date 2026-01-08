using AcityChallenge.Application.Common.Interfaces;
using AcityChallenge.Application.Usuarios.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Usuarios.Queries.GetUsuarios;

public record GetUsuariosQuery() : IRequest<List<UsuarioPerfilResponse>>;

public class GetUsuariosQueryHandler : IRequestHandler<GetUsuariosQuery, List<UsuarioPerfilResponse>>
{
    private readonly IApplicationDbContext _context;

    public GetUsuariosQueryHandler(IApplicationDbContext context) => _context = context;

    public async Task<List<UsuarioPerfilResponse>> Handle(GetUsuariosQuery request, CancellationToken cancellationToken)
    {
        return await _context.Usuarios
            .Select(u => new UsuarioPerfilResponse(
                u.Id,            // 1. Guid
                u.Nombre,        // 2. string
                u.Email,         // 3. string
                u.Rol,           // 4. string
                u.FechaCreacion  // 5. DateTime
            ))
            .ToListAsync(cancellationToken);
    }
}