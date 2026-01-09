using AcityChallenge.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AcityChallenge.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await context.Database.MigrateAsync();

        if (!await context.Usuarios.AnyAsync())
        {
            var admin = new Usuario
            {
                Id = Guid.NewGuid(),
                Nombre = "Prueba Seguridad",
                Email = "seguridad@ejemplo.com",
                // HASH DE LA CLAVE: 12345678
                PasswordHash = "$2a$11$76K6HdA.cLCwV8.mRLpEquJJYq5MW5UsjRwVU989qJrdeTXkugUHa",
                Rol = "Admin",
                FechaCreacion = DateTime.Now
            };

            context.Usuarios.Add(admin);
            await context.SaveChangesAsync();
        }
    }
}