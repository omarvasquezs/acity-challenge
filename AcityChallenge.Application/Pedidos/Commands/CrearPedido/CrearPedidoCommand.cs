using AcityChallenge.Application.Common.Interfaces;
using AcityChallenge.Domain.Entities;
using MediatR;

namespace AcityChallenge.Application.Pedidos.Commands.CrearPedido;

// El record DEBE tener Descripcion y NO NumeroPedido
public record CrearPedidoCommand(string Cliente, decimal Total, string Descripcion) : IRequest<int>;

public class CrearPedidoCommandHandler : IRequestHandler<CrearPedidoCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CrearPedidoCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CrearPedidoCommand request, CancellationToken cancellationToken)
    {
        // Generación automática del código
        var correlativo = DateTime.Now.ToString("yyyyMMdd");
        var aleatorio = Guid.NewGuid().ToString().Substring(0, 4).ToUpper();
        var nuevoNumero = $"PED-{correlativo}-{aleatorio}";

        var nuevoPedido = new Pedido
        {
            Cliente = request.Cliente,
            Total = request.Total,
            Descripcion = request.Descripcion, // Ahora request.Descripcion sí existe
            NumeroPedido = nuevoNumero,
            Estado = "Registrado",
            Fecha = DateTime.UtcNow
        };

        _context.Pedidos.Add(nuevoPedido);
        await _context.SaveChangesAsync(cancellationToken);

        return nuevoPedido.Id;
    }
}