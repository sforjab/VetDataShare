package com.uoc.tfm.vds_backend.usuario.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uoc.tfm.vds_backend.error.ApiError;
import com.uoc.tfm.vds_backend.jwt.CustomUserDetails;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import com.uoc.tfm.vds_backend.usuario.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    UsuarioService usuarioService;

    @GetMapping("/getUsuarioPorId/{id}")
    public ResponseEntity<Object> getUsuarioPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.getUsuarioPorId(id);

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Usuario no encontrado con ID: " + id));
        }
    }

    @GetMapping("/getUsuarioPorNumIdent/{numIdent}")
    public ResponseEntity<Object> getUsuarioPorNumIdent(@PathVariable String numIdent) {
        Optional<Usuario> usuario = usuarioService.getUsuarioPorNumIdent(numIdent);
        
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Usuario no encontrado con número de identificación: " + numIdent));
        }
    }

    @GetMapping("/getUsuarioPorUsername/{username}")
    public ResponseEntity<Object> getUsuarioPorUsername(@PathVariable String username) {
        Optional<Usuario> usuario = usuarioService.getUsuarioPorUsername(username);
        
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Usuario no encontrado con nombre de usuario: " + username));
        }
    }

    // Método para obtener el usuario logueado desde el token
    @GetMapping("/getUsuarioLogueado")
    public ResponseEntity<Object> getUsuarioLogueado(@RequestHeader("Authorization") String token) {
        try {

            // Obtenemos la autenticación actual desde el SecurityContextHolder
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            CustomUserDetails customDetails = (CustomUserDetails) authentication.getDetails();

            Long idUsuario = customDetails.getIdUsuario();

            // Se busca el usuario en la base de datos a partir del id
            Optional<Usuario> usuario = usuarioService.getUsuarioPorId(idUsuario);

            if (usuario.isPresent()) {
                return ResponseEntity.ok(usuario.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiError("Usuario no encontrado"));
            }
        } catch (Exception e) {
            System.out.println("Error en getUsuarioLogueado: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiError("Token inválido o usuario no encontrado"));
        }
    }

    // AÑADIR PARA BUSCAR CLIENTES

     @PostMapping("/create")
    public ResponseEntity<Object> createUsuario(@RequestBody Usuario usuario) {
        Optional<Usuario> createdUsuario = usuarioService.createUsuario(usuario);

        if (createdUsuario.isPresent()) {
            return ResponseEntity.ok(createdUsuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(new ApiError("Ya existe un usuario con el mismo número de identificación o nombre de usuario."));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        Optional<Usuario> updatedUsuario = usuarioService.updateUsuario(id, usuario);

        if (updatedUsuario.isPresent()) {
            return ResponseEntity.ok(updatedUsuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(new ApiError("No se pudo actualizar. Usuario no encontrado, número de identificación o nombre de usuario duplicado."));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteUsuario(@PathVariable Long id) {
        boolean isDeleted = usuarioService.deleteUsuario(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Usuario no encontrado con ID: " + id));
        }
    }
}
