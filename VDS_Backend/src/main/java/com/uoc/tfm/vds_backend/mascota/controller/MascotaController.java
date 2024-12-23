package com.uoc.tfm.vds_backend.mascota.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.uoc.tfm.vds_backend.error.ApiError;
import com.uoc.tfm.vds_backend.jwt.CustomUserDetails;
import com.uoc.tfm.vds_backend.mascota.dto.MascotaDTO;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    @Autowired
    MascotaService mascotaService;

    @GetMapping("/getMascotaPorId/{id}")
    public ResponseEntity<Object> getMascotaPorId(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            if ("TEMPORAL".equals(userDetails.getRol()) &&
                (userDetails.getIdMascota() == null || !userDetails.getIdMascota().equals(id))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiError("No tiene acceso a esta mascota."));
            }
        }

        Optional<MascotaDTO> mascotaDTO = mascotaService.getMascotaPorId(id);

        if (mascotaDTO.isPresent()) {
            return ResponseEntity.ok(mascotaDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Mascota no encontrada con ID: " + id));
        }
    }

    @GetMapping("/getMascotasPorIdUsuario/{id}")
    public ResponseEntity<List<MascotaDTO>> getMascotasPorIdUsuario(@PathVariable Long id) {
        List<MascotaDTO> mascotas = mascotaService.getMascotasPorIdUsuario(id);
        return ResponseEntity.ok(mascotas); // Siempre responde con 200 OK
    }

    @GetMapping("/verificarPropietario/{idMascota}")
    public ResponseEntity<Object> verificarPropietario(@PathVariable Long idMascota) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Permitir acceso a roles diferentes de CLIENTE
        if (!"CLIENTE".equals(userDetails.getRol())) {
            return ResponseEntity.ok().build();
        }

        // Validar si el cliente es propietario de la mascota
        boolean esPropietario = mascotaService.esPropietarioDeMascota(userDetails.getIdUsuario(), idMascota);

        if (esPropietario) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiError("No tiene acceso a esta mascota."));
        }
    }

    @GetMapping("/buscarMascotas")
    public ResponseEntity<List<MascotaDTO>> buscarMascotas(
            @RequestParam(required = false) String numChip,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String especie,
            @RequestParam(required = false) String raza) {
        return ResponseEntity.ok(mascotaService.buscarMascotas(numChip, nombre, especie, raza));
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createMascota(@RequestBody MascotaDTO mascotaDTO) {
        Optional<MascotaDTO> mascotaCreada = mascotaService.createMascota(mascotaDTO);

        if (mascotaCreada.isPresent()) {
            return ResponseEntity.ok(mascotaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Ya existe una mascota con el número de chip: " + mascotaDTO.getNumChip()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateMascota(@PathVariable Long id, @RequestBody MascotaDTO mascotaDTO) {
        Optional<MascotaDTO> mascotaModificada = mascotaService.updateMascota(id, mascotaDTO);

        if (mascotaModificada.isPresent()) {
            return ResponseEntity.ok(mascotaModificada.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("No se pudo actualizar. Mascota no encontrada o número de chip duplicado."));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteMascota(@PathVariable Long id) {
        if (mascotaService.deleteMascota(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiError("Mascota no encontrada con ID: " + id));
    }
}
