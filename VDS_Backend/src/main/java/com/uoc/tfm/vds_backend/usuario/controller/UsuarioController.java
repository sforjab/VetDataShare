package com.uoc.tfm.vds_backend.usuario.controller;

import java.util.List;
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
import org.springframework.web.bind.annotation.RequestParam;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getDetails();

        // Verificar si el ID del usuario autenticado coincide con el solicitado
        if (userDetails.getRol().equals("CLIENTE") && !userDetails.getIdUsuario().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                 .body(new ApiError("Acceso no autorizado."));
        }

        Optional<Usuario> usuario = usuarioService.getUsuarioPorId(id);

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Usuario no encontrado con ID: " + id));
        }
    }

    @GetMapping("/verificarIdentidadCliente/{idCliente}")
    public ResponseEntity<Object> verificarIdentidadCliente(@PathVariable Long idCliente) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getDetails();

        // Si el usuario es CLIENTE, se comprueba que el ID coincide
        if (userDetails.getRol().equals("CLIENTE") && !userDetails.getIdUsuario().equals(idCliente)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiError("Acceso no autorizado."));
        }

        // Permitir acceso para ADMIN o roles superiores
        return ResponseEntity.ok().build();
    }

    /* @GetMapping("/getUsuarioPorNumIdent/{numIdent}")
    public ResponseEntity<Object> getUsuarioPorNumIdent(@PathVariable String numIdent) {
        Optional<Usuario> usuario = usuarioService.getUsuarioPorNumIdent(numIdent);
        
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Usuario no encontrado con número de identificación: " + numIdent));
        }
    } */

    /* @GetMapping("/getUsuarioPorUsername/{username}")
    public ResponseEntity<Object> getUsuarioPorUsername(@PathVariable String username) {
        Optional<Usuario> usuario = usuarioService.getUsuarioPorUsername(username);
        
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Usuario no encontrado con nombre de usuario: " + username));
        }
    } */

    @GetMapping("/buscarClientes")
    public ResponseEntity<Object> buscarClientes(
            @RequestParam(required = false) String numIdent,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido1,
            @RequestParam(required = false) String apellido2,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String email) {

        List<Usuario> clientes = usuarioService.buscarClientes(numIdent, nombre, apellido1, apellido2, telefono, email);
        return ResponseEntity.ok(clientes);
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createUsuario(@RequestBody Usuario usuario) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getDetails();

        // Verificar que el rol no sea CLIENTE
        if (userDetails.getRol().equals("CLIENTE")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(new ApiError("Acceso no autorizado para crear usuarios."));
        }

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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getDetails();

        // Verificar si el usuario autenticado está autorizado a modificar este recurso
        if (userDetails.getRol().equals("CLIENTE") && !userDetails.getIdUsuario().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                 .body(new ApiError("Acceso no autorizado para editar este usuario."));
        }

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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getDetails();

        // Verificar que el rol no sea CLIENTE
        if (userDetails.getRol().equals("CLIENTE")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(new ApiError("Acceso no autorizado para eliminar usuarios."));
        }

        boolean isDeleted = usuarioService.deleteUsuario(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Usuario no encontrado con ID: " + id));
        }
    }
}
