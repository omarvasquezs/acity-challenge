using AcityChallenge.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Pedidos.Queries.GetPedidos;

// Definimos un DTO para no exponer la entidad directamente
public record PedidoDto(
    int Id,
    string NumeroPedido,
    string Cliente,
    string? Descripcion, // Incluimos el nuevo campo
    DateTime Fecha,
    decimal Total,
    string Estado);

// La Query ahora devuelve una lista de DTOs
public record GetPedidosQuery : IRequest<List<PedidoDto>>;

public class GetPedidosQueryHandler : IRequestHandler<GetPedidosQuery, List<PedidoDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPedidosQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PedidoDto>> Handle(GetPedidosQuery request, CancellationToken cancellationToken)
    {
        // Realizamos el mapeo manual para asegurar que Descripcion se incluya
        return await _context.Pedidos
            .OrderByDescending(p => p.Fecha) // Mantenemos tu orden lógico
            .Select(p => new PedidoDto(
                p.Id,
                p.NumeroPedido,
                p.Cliente,
                p.Descripcion, // Mapeo de la nueva columna
                p.Fecha,
                p.Total,
                p.Estado
            ))
            .ToListAsync(cancellationToken);
    }
}