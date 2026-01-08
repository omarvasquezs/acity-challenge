namespace AcityChallenge.Application.Usuarios.Common;

public record UsuarioPerfilResponse(Guid Id, string Nombre, string Email, string Rol, DateTime FechaCreacion);