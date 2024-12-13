package com.uoc.tfm.vds_backend.auth.controller;

import java.util.Map;
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
import com.uoc.tfm.vds_backend.auth.model.RestablecerPasswordRequest;
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
        // Recuperar el usuario directamente desde la base de datos (no usar DTO aquí).
        Optional<Usuario> usuario = usuarioService.getUsuarioEntityPorUsername(loginRequest.getUsername());

        if (usuario.isEmpty()) {
            System.out.println("Usuario no encontrado: " + loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Verificar la contraseña usando la entidad Usuario
        if (passwordEncoder.matches(loginRequest.getPassword(), usuario.get().getPassword())) {
            System.out.println("Usuario autenticado: " + loginRequest.getUsername());

            // Generar token JWT
            String token = jwtService.generateToken(usuario.get(), usuario.get().getId());

            // Devolver respuesta con el token
            return ResponseEntity.ok(new AuthResponse(token, usuario.get().getRol().toString(), usuario.get().getId()));
        }

        System.out.println("Fallo en la autenticación para usuario: " + loginRequest.getUsername());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/olvidar-password")
    public ResponseEntity<?> olvidarPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        try {
            usuarioService.enviarEmailRestablecimiento(email);
            return ResponseEntity.ok(Map.of("message", "Correo enviado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/restablecer-password")
    public ResponseEntity<?> restablecerPassword(@RequestBody RestablecerPasswordRequest request) {
        try {
            usuarioService.restablecerPassword(request.getToken(), request.getPassword());
            return ResponseEntity.ok(Map.of("message", "Contraseña restablecida correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
