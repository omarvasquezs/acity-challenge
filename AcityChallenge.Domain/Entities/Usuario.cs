namespace AcityChallenge.Domain.Entities;

public class Usuario
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Rol { get; set; } = "User";
    public string SecurityStamp { get; set; } = Guid.NewGuid().ToString();
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
