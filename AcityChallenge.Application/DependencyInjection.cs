using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace AcityChallenge.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Esto registra automáticamente todos los Handlers de MediatR
        // que definamos en este proyecto.
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
        });

        return services;
    }
}