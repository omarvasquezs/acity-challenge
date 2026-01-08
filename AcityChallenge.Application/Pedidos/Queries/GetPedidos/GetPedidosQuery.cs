using AcityChallenge.Application.Common.Interfaces;
using AcityChallenge.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Pedidos.Queries.GetPedidos;

public record GetPedidosQuery : IRequest<List<Pedido>>;

public class GetPedidosQueryHandler : IRequestHandler<GetPedidosQuery, List<Pedido>>
{
    private readonly IApplicationDbContext _context;
    public GetPedidosQueryHandler(IApplicationDbContext context) => _context = context;

    public async Task<List<Pedido>> Handle(GetPedidosQuery request, CancellationToken cancellationToken)
    {
        return await _context.Pedidos
            .OrderByDescending(p => p.Fecha)
            .ToListAsync(cancellationToken);
    }
}