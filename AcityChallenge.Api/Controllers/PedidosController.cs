using AcityChallenge.Application.Pedidos.Commands.ActualizarPedido;
using Microsoft.AspNetCore.RateLimiting;
using AcityChallenge.Application.Pedidos.Commands.CrearPedido;
using AcityChallenge.Application.Pedidos.Commands.EliminarPedido;
using AcityChallenge.Application.Pedidos.Queries.GetPedidoById;
using AcityChallenge.Application.Pedidos.Queries.GetPedidos;
using AcityChallenge.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcityChallenge.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("fixed")]
public class PedidosController : ControllerBase
{
    private readonly ISender _mediator;
    public PedidosController(ISender mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<List<Pedido>>> Get() => Ok(await _mediator.Send(new GetPedidosQuery()));

    [HttpGet("{id}")]
    public async Task<ActionResult<Pedido>> GetById(int id)
    {
        var result = await _mediator.Send(new GetPedidoByIdQuery(id));
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] CrearPedidoCommand command)
        => Ok(await _mediator.Send(command));

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] ActualizarPedidoCommand command)
    {
        if (id != command.Id) return BadRequest();
        var result = await _mediator.Send(command);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _mediator.Send(new EliminarPedidoCommand(id));
        return result ? NoContent() : NotFound();
    }
}