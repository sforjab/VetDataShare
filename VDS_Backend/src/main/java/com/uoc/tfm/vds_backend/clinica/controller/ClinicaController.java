package com.uoc.tfm.vds_backend.clinica.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.uoc.tfm.vds_backend.clinica.dto.ClinicaDTO;
import com.uoc.tfm.vds_backend.clinica.service.ClinicaService;
import com.uoc.tfm.vds_backend.error.ApiError;
import com.uoc.tfm.vds_backend.jwt.CustomUserDetails;
import com.uoc.tfm.vds_backend.usuario.dto.UsuarioDTO;
import com.uoc.tfm.vds_backend.usuario.service.UsuarioService;

@RestController
@RequestMapping("/api/clinicas")
public class ClinicaController {

    @Autowired
    ClinicaService clinicaService;

    @Autowired
    UsuarioService usuarioService;

    @GetMapping("/getClinicaPorId/{id}")
    public ResponseEntity<Object> getClinicaPorId(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String rol = userDetails.getRol();

            // Solo verificamos para el rol ADMIN_CLINICA
            if ("ADMIN_CLINICA".equals(rol)) {
                Long idUsuario = userDetails.getIdUsuario();

                // Obtenemos el usuario actual para verificar su idClinica
                Optional<UsuarioDTO> usuarioOpt = usuarioService.getUsuarioPorId(idUsuario);
                if (usuarioOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiError("No se encontró el usuario en sesión."));
                }

                UsuarioDTO usuario = usuarioOpt.get();

                // Comparamos el idClinica del usuario con el solicitado
                if (!usuario.getClinicaId().equals(id)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiError("Acceso no autorizado a la clínica solicitada."));
                }
            }
        }

        // Si pasa las verificaciones, obtenemos la clínica
        Optional<ClinicaDTO> clinicaDTO = clinicaService.getClinicaPorId(id);
        if (clinicaDTO.isPresent()) {
            return ResponseEntity.ok(clinicaDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Clínica no encontrada con ID: " + id));
        }
    }



    @GetMapping("/getClinicaPorNombre/{nombre}")
    public ResponseEntity<Object> getClinicaPorNombre(@PathVariable String nombre) {
        Optional<ClinicaDTO> clinicaDTO = clinicaService.getClinicaPorNombre(nombre);
        if (clinicaDTO.isPresent()) {
            return ResponseEntity.ok(clinicaDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Clínica no encontrada con nombre: " + nombre));
        }
    }    

    @GetMapping("/buscarClinicas")
    public ResponseEntity<List<ClinicaDTO>> buscarClinicas(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String direccion,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Boolean activo) {
        return ResponseEntity.ok(clinicaService.buscarClinicas(nombre, direccion, telefono, email, activo));
    }

    /* @PostMapping("/create")
    public ResponseEntity<Object> createClinica(@RequestBody ClinicaDTO clinicaDTO) {
        Optional<ClinicaDTO> clinicaCreada = clinicaService.createClinica(clinicaDTO);

        if (clinicaCreada.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(clinicaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Error al crear la clínica. Nombre ya en uso."));
        }
    } */

    @PostMapping("/create")
    public ResponseEntity<Object> createClinica(@RequestBody ClinicaDTO clinicaDTO) {
        try {
            Optional<ClinicaDTO> clinicaCreada = clinicaService.createClinica(clinicaDTO);

            if (clinicaCreada.isPresent()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(clinicaCreada.get());
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiError("El nombre de la clínica ya está en uso. Intente con otro nombre."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiError("Error interno al crear la clínica: " + e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateClinica(@PathVariable Long id, @RequestBody ClinicaDTO clinicaDTO) {
        Optional<ClinicaDTO> clinicaActualizada = clinicaService.updateClinica(id, clinicaDTO);

        if (clinicaActualizada.isPresent()) {
            return ResponseEntity.ok(clinicaActualizada.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("No se pudo actualizar. Clínica no encontrada."));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteClinica(@PathVariable Long id) {
        boolean clinicaEliminada = clinicaService.deleteClinica(id);

        if (clinicaEliminada) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Clínica no encontrada con ID: " + id));
        }
    }

    @PutMapping("/darBajaClinica/{idClinica}")
    public ResponseEntity<Map<String, String>> darBajaClinica(@PathVariable Long idClinica) {
        try {
            clinicaService.darBajaClinica(idClinica);
            return ResponseEntity.ok(Map.of("message", "Clínica dada de baja con éxito"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
