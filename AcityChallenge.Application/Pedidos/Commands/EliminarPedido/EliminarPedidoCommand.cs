using AcityChallenge.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Pedidos.Commands.EliminarPedido;

// Definición del Command
public record EliminarPedidoCommand(int Id) : IRequest<bool>;

// Manejador del Command (Handler)
public class EliminarPedidoCommandHandler : IRequestHandler<EliminarPedidoCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public EliminarPedidoCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(EliminarPedidoCommand request, CancellationToken cancellationToken)
    {
        // Buscamos el registro por su ID de forma asíncrona
        var pedido = await _context.Pedidos
            .FindAsync(new object[] { request.Id }, cancellationToken);

        // Si no existe, devolvemos false para que el Controller retorne NotFound
        if (pedido == null) return false;

        // --- CAMBIO PARA BORRADO FÍSICO ---
        // Eliminamos la entidad por completo del contexto de base de datos
        _context.Pedidos.Remove(pedido);

        // Guardamos los cambios para ejecutar el DELETE físico en SQL Server
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}