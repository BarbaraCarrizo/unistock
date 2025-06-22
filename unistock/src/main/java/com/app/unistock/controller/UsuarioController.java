package com.app.unistock.controller;

import com.app.unistock.model.Usuario;
import com.app.unistock.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
        return ResponseEntity.ok(nuevoUsuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario usuario) {
        Usuario usuarioValido = usuarioService.validarUsuario(usuario.getNombre(), usuario.getContrasena());
        if (usuarioValido != null) {
            return ResponseEntity.ok(usuarioValido);
        } else {
            return ResponseEntity.status(401).build();
        }
    }
}
