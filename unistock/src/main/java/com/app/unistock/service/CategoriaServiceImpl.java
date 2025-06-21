package com.app.unistock.service;

import com.app.unistock.model.Categoria;
import com.app.unistock.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    public Categoria guardarCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    public void eliminarCategoria(int id) {
        categoriaRepository.deleteById(id);
    }

    @Override
    public Categoria obtenerCategoriaPorId(int id) {
        return categoriaRepository.findById(id).orElse(null);
    }
}
