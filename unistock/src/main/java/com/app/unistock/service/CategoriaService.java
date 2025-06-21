package com.app.unistock.service;

import com.app.unistock.model.Categoria;
import java.util.List;

public interface CategoriaService {
    List<Categoria> listarCategorias();
    Categoria obtenerCategoriaPorId(int id);
    Categoria guardarCategoria(Categoria categoria);
    void eliminarCategoria(int id);
}