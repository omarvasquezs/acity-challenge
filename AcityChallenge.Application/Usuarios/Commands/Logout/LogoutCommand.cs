using AcityChallenge.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Usuarios.Commands.Logout;

public record LogoutCommand(string Email) : IRequest<bool>;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public LogoutCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(LogoutCommand request, CancellationToken ct)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == request.Email, ct);

        if (usuario == null) return false;

        // Cambiamos el sello: todos los tokens anteriores ahora tienen un sello "viejo"
        usuario.SecurityStamp = Guid.NewGuid().ToString();

        await _context.SaveChangesAsync(ct);
        return true;
    }
}