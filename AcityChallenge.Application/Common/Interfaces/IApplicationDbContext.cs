using AcityChallenge.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Usuario> Usuarios { get; }
    DbSet<Pedido> Pedidos { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}