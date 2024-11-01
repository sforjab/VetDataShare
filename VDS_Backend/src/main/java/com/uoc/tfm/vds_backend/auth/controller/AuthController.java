package com.uoc.tfm.vds_backend.auth.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uoc.tfm.vds_backend.auth.model.AuthResponse;
import com.uoc.tfm.vds_backend.auth.model.LoginRequest;
import com.uoc.tfm.vds_backend.jwt.JwtService;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import com.uoc.tfm.vds_backend.usuario.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuario = usuarioService.getUsuarioPorUsername(loginRequest.getUsername());

        if (usuario.isEmpty()) {
            System.out.println("Usuario no encontrado: " + loginRequest.getUsername());
        }

        if (usuario.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), usuario.get().getPassword())) {
            System.out.println("Usuario autenticado: " + loginRequest.getUsername());
            String token = jwtService.generateToken(usuario.get(), usuario.get().getId());
            return ResponseEntity.ok(new AuthResponse(token, usuario.get().getRol().toString()));
        }

        System.out.println("Fallo en la autenticación para usuario: " + loginRequest.getUsername());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
