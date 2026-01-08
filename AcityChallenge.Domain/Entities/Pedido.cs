namespace AcityChallenge.Domain.Entities;

public class Pedido
{
    public int Id { get; set; }
    public string NumeroPedido { get; set; } = string.Empty;
    public string Cliente { get; set; } = string.Empty;
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public decimal Total { get; set; }
    public string Estado { get; set; } = "Registrado";
    public bool IsDeleted { get; set; } = false;
}