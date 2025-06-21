package com.app.unistock.controller;

import com.app.unistock.model.MovimientoInventario;
import com.app.unistock.service.MovimientoInventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "*")
public class MovimientoInventarioController {

    @Autowired
    private MovimientoInventarioService movimientoService;

    @GetMapping
    public List<MovimientoInventario> listarMovimientos() {
        return movimientoService.listarMovimientos();
    }

    @GetMapping("/{id}")
    public MovimientoInventario obtenerMovimiento(@PathVariable int id) {
        return movimientoService.obtenerMovimientoPorId(id);
    }

    @PostMapping
    public MovimientoInventario crearMovimiento(@RequestBody MovimientoInventario movimiento) {
        return movimientoService.guardarMovimiento(movimiento);
    }

    @PutMapping("/{id}")
    public MovimientoInventario actualizarMovimiento(@PathVariable int id, @RequestBody MovimientoInventario movimiento) {
    movimiento.setId(id);
    return movimientoService.guardarMovimiento(movimiento);
    }

    @DeleteMapping("/{id}")
    public void eliminarMovimiento(@PathVariable int id) {
        movimientoService.eliminarMovimiento(id);
    }

}