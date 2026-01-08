using AcityChallenge.Application.Common.Interfaces;
using AcityChallenge.Application.Usuarios.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AcityChallenge.Application.Usuarios.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<LoginResponse>;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public LoginCommandHandler(IApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
        {
            throw new Exception("Credenciales inválidas.");
        }

        // Obtenemos los minutos de expiración de la configuración
        var expiryMinutes = int.Parse(_configuration["JwtSettings:ExpiryMinutes"]!);
        var expiresInSeconds = expiryMinutes * 60; // Convertimos a segundos (3600)

        var token = GenerateJwtToken(usuario.Email);

        // Retornamos el formato solicitado: token y expiresIn
        return new LoginResponse(token, expiresInSeconds);
    }

    private string GenerateJwtToken(string email)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));

        var claims = new[] {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(securityToken);
    }
}