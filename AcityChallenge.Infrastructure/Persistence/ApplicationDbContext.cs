using AcityChallenge.Application.Common.Interfaces;
using AcityChallenge.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración Senior: Usamos Fluent API para no ensuciar la entidad
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("Usuarios");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
            entity.HasIndex(e => e.Email).IsUnique();
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(p => p.Total).HasColumnType("decimal(10,2)");
            entity.HasIndex(p => p.NumeroPedido).IsUnique();
            entity.Property(p => p.Descripcion).HasMaxLength(250);
        });
    }
}
