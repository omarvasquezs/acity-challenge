using AcityChallenge.Application.Common.Interfaces;
using MediatR;

namespace AcityChallenge.Application.Pedidos.Commands.EliminarPedido;

public record EliminarPedidoCommand(int Id) : IRequest<bool>;

public class EliminarPedidoCommandHandler : IRequestHandler<EliminarPedidoCommand, bool>
{
    private readonly IApplicationDbContext _context;
    public EliminarPedidoCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(EliminarPedidoCommand request, CancellationToken cancellationToken)
    {
        var pedido = await _context.Pedidos.FindAsync(new object[] { request.Id }, cancellationToken);

        if (pedido == null) return false;

        pedido.IsDeleted = true; // No borramos físicamente el registro
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}