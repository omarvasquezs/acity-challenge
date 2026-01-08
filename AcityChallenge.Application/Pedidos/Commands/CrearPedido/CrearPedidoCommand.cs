using AcityChallenge.Application.Common.Interfaces;
using AcityChallenge.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Pedidos.Commands.CrearPedido;

public record CrearPedidoCommand(string NumeroPedido, string Cliente, decimal Total) : IRequest<int>;

public class CrearPedidoCommandHandler : IRequestHandler<CrearPedidoCommand, int>
{
    private readonly IApplicationDbContext _context;
    public CrearPedidoCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<int> Handle(CrearPedidoCommand request, CancellationToken cancellationToken)
    {
        // Regla 1: Total > 0
        if (request.Total <= 0) throw new Exception("El total debe ser mayor a 0.");

        // Regla 2: NumeroPedido único
        if (await _context.Pedidos.AnyAsync(p => p.NumeroPedido == request.NumeroPedido, cancellationToken))
            throw new Exception("El número de pedido ya existe.");

        var pedido = new Pedido
        {
            NumeroPedido = request.NumeroPedido,
            Cliente = request.Cliente,
            Total = request.Total,
            Fecha = DateTime.UtcNow,
            Estado = "Registrado"
        };

        _context.Pedidos.Add(pedido);
        await _context.SaveChangesAsync(cancellationToken);
        return pedido.Id;
    }
}