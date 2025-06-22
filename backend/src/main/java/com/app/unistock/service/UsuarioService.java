package com.app.unistock.service;

import com.app.unistock.model.Usuario;

public interface UsuarioService {
    Usuario registrarUsuario(Usuario usuario);
    Usuario validarUsuario(String nombre, String contrasena);
}
