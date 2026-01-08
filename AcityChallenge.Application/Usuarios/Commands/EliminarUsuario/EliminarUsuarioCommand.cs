using AcityChallenge.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Usuarios.Commands.EliminarUsuario;

// Definimos el Command recibiendo el Guid del usuario
public record EliminarUsuarioCommand(Guid Id) : IRequest<bool>;

public class EliminarUsuarioCommandHandler : IRequestHandler<EliminarUsuarioCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public EliminarUsuarioCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(EliminarUsuarioCommand request, CancellationToken cancellationToken)
    {
        // Buscamos al usuario en la tabla Usuarios
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (usuario == null) return false;

        // Ejecutamos el borrado físico
        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}