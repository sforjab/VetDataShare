package com.uoc.tfm.vds_backend.usuario.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.uoc.tfm.vds_backend.error.ApiError;
import com.uoc.tfm.vds_backend.jwt.CustomUserDetails;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;
import com.uoc.tfm.vds_backend.usuario.dto.UsuarioDTO;
import com.uoc.tfm.vds_backend.usuario.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    UsuarioService usuarioService;

    @Autowired
    MascotaService mascotaService;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("getUsuarioPorId/{id}")
    public ResponseEntity<Object> getUsuarioPorId(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String rolUsuario = userDetails.getRol();

            // Caso 0: TEMPORAL no debería acceder a este endpoint
            if ("TEMPORAL".equals(rolUsuario)) {
                Optional<UsuarioDTO> usuarioOpt = usuarioService.getUsuarioPorId(id);
                if (usuarioOpt.isPresent()) {
                    return ResponseEntity.ok(usuarioOpt.get());
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiError("Usuario no encontrado."));
                }
            }

            Long idUsuarioSesion = userDetails.getIdUsuario();

            // Caso 1: CLIENTE solo puede acceder a su propio perfil
            if ("CLIENTE".equals(rolUsuario)) {
                if (!idUsuarioSesion.equals(id)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiError("Acceso no autorizado. Solo puedes acceder a tu propio perfil."));
                }
                Optional<UsuarioDTO> usuarioOpt = usuarioService.getUsuarioPorId(id);
                if (usuarioOpt.isPresent()) {
                    return ResponseEntity.ok(usuarioOpt.get());
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiError("Usuario no encontrado."));
                }
            }

            // Caso 2: VETERINARIO puede acceder a:
            // - Su propio perfil
            // - Clientes sin restricciones
            if ("VETERINARIO".equals(rolUsuario)) {
                Optional<UsuarioDTO> usuarioOpt = usuarioService.getUsuarioPorId(id);
                if (usuarioOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiError("Usuario no encontrado."));
                }

                UsuarioDTO usuario = usuarioOpt.get();
                if ("CLIENTE".equals(usuario.getRol()) || idUsuarioSesion.equals(id)) {
                    return ResponseEntity.ok(usuario);
                }

                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiError("Acceso no autorizado. Solo puedes acceder a clientes o a tu propio perfil."));
            }

            // Caso 3: ADMIN_CLINICA puede acceder a:
            // - Clientes sin restricciones
            // - Usuarios de su clínica
            if ("ADMIN_CLINICA".equals(rolUsuario)) {
                Optional<UsuarioDTO> usuarioSesionOpt = usuarioService.getUsuarioPorId(idUsuarioSesion);
                if (usuarioSesionOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiError("Usuario no encontrado en la sesión."));
                }

                UsuarioDTO usuarioSesion = usuarioSesionOpt.get();

                Optional<UsuarioDTO> usuarioOpt = usuarioService.getUsuarioPorId(id);
                if (usuarioOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiError("Usuario no encontrado."));
                }

                UsuarioDTO usuario = usuarioOpt.get();

                // Validar acceso a cualquier cliente
                if ("CLIENTE".equals(usuario.getRol())) {
                    return ResponseEntity.ok(usuario);
                }

                // Validar que el usuario pertenece a la misma clínica
                if (usuarioSesion.getClinicaId() == null || !usuarioSesion.getClinicaId().equals(usuario.getClinicaId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiError("Acceso no autorizado. Este usuario no pertenece a su clínica."));
                }

                return ResponseEntity.ok(usuario);
            }

            // Caso 4: ADMIN puede acceder a cualquier usuario
            if ("ADMIN".equals(rolUsuario)) {
                Optional<UsuarioDTO> usuarioOpt = usuarioService.getUsuarioPorId(id);
                if (usuarioOpt.isPresent()) {
                    return ResponseEntity.ok(usuarioOpt.get());
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiError("Usuario no encontrado."));
                }
            }
        }

        // Si no pasa ninguna validación
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiError("Acceso no autorizado."));
    }


    @GetMapping("/getNumColegiadoPorIdVet/{id}")
    public ResponseEntity<Object> getNumColegiadoPorIdVet(@PathVariable Long id) {
        Optional<UsuarioDTO> usuarioDTO = usuarioService.getUsuarioPorId(id);

        if (usuarioDTO.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Veterinario no encontrado con ID: " + id));
        }

        UsuarioDTO usuario = usuarioDTO.get();

        // Devolver solo el número de colegiado
        return ResponseEntity.ok(Map.of("numColegiado", usuario.getNumColegiado()));
    }


    @GetMapping("/getUsuarioPorNumIdent/{numIdent}")
    public ResponseEntity<Object> getUsuarioPorNumIdent(@PathVariable String numIdent) {
        Optional<UsuarioDTO> usuario = usuarioService.getUsuarioPorNumIdent(numIdent);

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Usuario no encontrado con el número de identificación: " + numIdent));
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

    @GetMapping("/buscarClientes")
    public ResponseEntity<List<UsuarioDTO>> buscarClientes(
            @RequestParam(required = false) String numIdent,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido1,
            @RequestParam(required = false) String apellido2,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String email) {

        List<UsuarioDTO> clientes = usuarioService.buscarClientes(numIdent, nombre, apellido1, apellido2, telefono, email);
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/buscarEmpleados/{idClinica}")
    public ResponseEntity<Object> buscarEmpleados(
            @PathVariable Long idClinica,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido1,
            @RequestParam(required = false) String apellido2,
            @RequestParam(required = false) String rol) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String rolUsuario = userDetails.getRol();

            if ("ADMIN_CLINICA".equals(rolUsuario)) {
                Long idUsuario = userDetails.getIdUsuario();
                Optional<UsuarioDTO> usuarioOpt = usuarioService.getUsuarioPorId(idUsuario);

                if (usuarioOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiError("Usuario no encontrado."));
                }

                UsuarioDTO usuario = usuarioOpt.get();

                // Se valida que el 'idClinica' del usuario coincida con el 'idClinica' solicitado
                if (!usuario.getClinicaId().equals(idClinica)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiError("Acceso no autorizado a esta clínica."));
                }
            }
        }

        List<UsuarioDTO> empleados = usuarioService.buscarEmpleados(idClinica, nombre, apellido1, apellido2, rol);
        return ResponseEntity.ok(empleados);
    }

    @PostMapping("/mascotas/transferir")
    public ResponseEntity<String> transferirMascotas(@RequestBody Map<String, String> transferData) {
        String numIdentOrigen = transferData.get("idOrigen");
        String numIdentDestino = transferData.get("idDestino");
        String idMascota = transferData.get("idMascota");

        try {
            usuarioService.transferirMascotas(numIdentOrigen, numIdentDestino,
                idMascota != null ? Optional.of(Long.parseLong(idMascota)) : Optional.empty());
            return ResponseEntity.ok("Transferencia de mascota(s) completada con éxito.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/solicitar-presupuesto")
    public ResponseEntity<Map<String, String>> solicitarPresupuesto(@RequestBody Map<String, String> datos) {
        String nombreClinica = datos.get("nombreClinica");
        String direccion = datos.get("direccion");
        String telefono = datos.get("telefono");
        String responsable = datos.get("responsable");

        // Crear el contenido del correo
        String mensaje = String.format(
            "Nueva solicitud de presupuesto:\n\n" +
            "Nombre de la Clínica: %s\n" +
            "Dirección: %s\n" +
            "Teléfono: %s\n" +
            "Responsable: %s",
            nombreClinica, direccion, telefono, responsable
        );

        try {
            // Se configura y se envía el correo
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo("vetdatashare@gmail.com");
            email.setSubject("Solicitud de Presupuesto");
            email.setText(mensaje);
            mailSender.send(email);

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Solicitud enviada con éxito"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "status", "error",
                "message", "Error al enviar la solicitud"
            ));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // Verificar que solo roles permitidos puedan crear usuarios
            if ("CLIENTE".equals(userDetails.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiError("Acceso no autorizado para crear usuarios."));
            }
        }

        Optional<UsuarioDTO> createdUsuario = usuarioService.createUsuario(usuarioDTO);

        if (createdUsuario.isPresent()) {
            return ResponseEntity.ok(createdUsuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Ya existe un usuario con el mismo número de identificación o nombre de usuario."));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateUsuario(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // Verificar que el usuario pueda modificar su propio perfil
            if ("CLIENTE".equals(userDetails.getRol()) && !userDetails.getIdUsuario().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiError("Acceso no autorizado para modificar este usuario."));
            }
        }

        Optional<UsuarioDTO> updatedUsuario = usuarioService.updateUsuario(id, usuarioDTO);

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

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // Verificar que solo roles permitidos puedan eliminar usuarios
            if ("CLIENTE".equals(userDetails.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiError("Acceso no autorizado para eliminar usuarios."));
            }
        }

        boolean isDeleted = usuarioService.deleteUsuario(id);

        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Usuario no encontrado con ID: " + id));
        }
    }

    @PutMapping("/desvincularEmpleado/{idEmpleado}")
    public ResponseEntity<Map<String, String>> desvincularEmpleado(@PathVariable Long idEmpleado) {
        try {
            usuarioService.desvincularEmpleado(idEmpleado);
            Map<String, String> response = Map.of("message", "Empleado desvinculado con éxito");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

}