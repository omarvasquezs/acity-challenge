using AcityChallenge.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (!await context.Usuarios.AnyAsync())
        {
            var admin = new Usuario
            {
                Id = Guid.NewGuid(),
                Nombre = "Prueba Seguridad",
                Email = "seguridad@ejemplo.com",
                // HASH DE LA CLAVE: 12345678
                PasswordHash = "$2a$11$K79S3M.f8OqYf0Y6jR5zS8z9x8v7u6t5s4r3q2p1oG1mH2jK3l4m",
                Rol = "Admin",
                FechaCreacion = DateTime.Now
            };

            context.Usuarios.Add(admin);
            await context.SaveChangesAsync();
        }
    }
}