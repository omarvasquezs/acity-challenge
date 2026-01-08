using AcityChallenge.Application.Common.Interfaces;
using AcityChallenge.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Pedidos.Queries.GetPedidoById;

public record GetPedidoByIdQuery(int Id) : IRequest<Pedido?>;

public class GetPedidoByIdQueryHandler : IRequestHandler<GetPedidoByIdQuery, Pedido?>
{
    private readonly IApplicationDbContext _context;
    public GetPedidoByIdQueryHandler(IApplicationDbContext context) => _context = context;

    public async Task<Pedido?> Handle(GetPedidoByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Pedidos
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
    }
}