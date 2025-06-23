package com.app.unistock.service;

import com.app.unistock.model.MovimientoInventario;
import com.app.unistock.model.Producto;
import com.app.unistock.model.TipoMovimiento;
import com.app.unistock.repository.MovimientoInventarioRepository;
import com.app.unistock.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovimientoInventarioServiceImpl implements MovimientoInventarioService {

    @Autowired
    private MovimientoInventarioRepository movimientoInventarioRepository;
    @Autowired
    private ProductoRepository productoRepository;

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
        // Actualizar stock del producto
        Producto producto = productoRepository.findById(movimiento.getProducto().getId()).orElse(null);
        if (producto != null) {
            if (movimiento.getTipo() == TipoMovimiento.ENTRADA) {
                producto.setStock(producto.getStock() + movimiento.getCantidad());
            } else if (movimiento.getTipo() == TipoMovimiento.SALIDA) {
                producto.setStock(producto.getStock() - movimiento.getCantidad());
            }
            productoRepository.save(producto);
        }
        return movimientoInventarioRepository.save(movimiento);
    }

    @Override
    public void eliminarMovimiento(int id) {
        movimientoInventarioRepository.deleteById(id);
    }
}