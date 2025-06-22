package com.app.unistock.service;

import com.app.unistock.model.Producto;
import java.util.List;

public interface ProductoService {
    List<Producto> listarProductos();
    Producto obtenerProductoPorId(int id);
    Producto guardarProducto(Producto producto);
    void eliminarProducto(int id);
}