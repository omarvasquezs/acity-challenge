using AcityChallenge.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Pedidos.Commands.ActualizarPedido;

public record ActualizarPedidoCommand(int Id, string Cliente, decimal Total, string Estado) : IRequest<bool>;

public class ActualizarPedidoCommandHandler : IRequestHandler<ActualizarPedidoCommand, bool>
{
    private readonly IApplicationDbContext _context;
    public ActualizarPedidoCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(ActualizarPedidoCommand request, CancellationToken cancellationToken)
    {
        var pedido = await _context.Pedidos.FindAsync(new object[] { request.Id }, cancellationToken);

        if (pedido == null || pedido.IsDeleted) return false;

        if (request.Total <= 0) throw new Exception("El total debe ser mayor a 0.");

        pedido.Cliente = request.Cliente;
        pedido.Total = request.Total;
        pedido.Estado = request.Estado;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}