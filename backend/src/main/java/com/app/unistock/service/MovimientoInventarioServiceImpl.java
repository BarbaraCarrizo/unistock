package com.app.unistock.service;

import com.app.unistock.model.MovimientoInventario;
import com.app.unistock.repository.MovimientoInventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovimientoInventarioServiceImpl implements MovimientoInventarioService {

    @Autowired
    private MovimientoInventarioRepository movimientoInventarioRepository;

    @Override
    public List<MovimientoInventario> listarMovimientos() {
        return movimientoInventarioRepository.findAll();
    }

    @Override
    public MovimientoInventario obtenerMovimientoPorId(int id) {
        return movimientoInventarioRepository.findById(id).orElse(null);
    }

    @Override
    public MovimientoInventario guardarMovimiento(MovimientoInventario movimiento) {
        return movimientoInventarioRepository.save(movimiento);
    }

    @Override
    public void eliminarMovimiento(int id) {
        movimientoInventarioRepository.deleteById(id);
    }
}