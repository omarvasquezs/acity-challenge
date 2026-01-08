namespace AcityChallenge.Application.Usuarios.Common;

public record LoginResponse(string Token, int ExpiresIn);