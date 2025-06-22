package com.app.unistock.service;

import com.app.unistock.model.MovimientoInventario;
import java.util.List;

public interface MovimientoInventarioService {
    List<MovimientoInventario> listarMovimientos();
    MovimientoInventario obtenerMovimientoPorId(int id);
    MovimientoInventario guardarMovimiento(MovimientoInventario movimiento);
    void eliminarMovimiento(int id);
}