package com.uoc.tfm.vds_backend.mascota.controller;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uoc.tfm.vds_backend.error.ApiError;
import com.uoc.tfm.vds_backend.jwt.CustomUserDetails;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;


@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {
    @Autowired
    MascotaService mascotaService;

    @GetMapping("/getMascotaPorId/{id}")
    public ResponseEntity<Object> getMascotaPorId(@PathVariable Long id) {
        Optional<Mascota> mascota = mascotaService.getMascotaPorId(id);

        if (mascota.isPresent()) {
            return ResponseEntity.ok(mascota.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiError("Mascota no encontrada con ID: " + id));
        }
    }

    @GetMapping("/getMascotaPorNumChip/{numChip}")
    public ResponseEntity<Object> getMascotaPorNumChip(@PathVariable String numChip) {
        Optional<Mascota> mascota = mascotaService.getMascotaPorNumChip(numChip);

        if (mascota.isPresent()) {
            return ResponseEntity.ok(mascota.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiError("Mascota no encontrada con número de chip: " + numChip));
        }
    }

    @GetMapping("/getMascotaPorNombre/{nombre}")
    public ResponseEntity<Object> getMascotaPorNombre(@PathVariable String nombre) {
        List<Mascota> mascotas = mascotaService.getMascotaPorNombre(nombre);

        if (mascotas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiError("No se encontraron mascotas con el nombre: " + nombre));
        } else {
            return ResponseEntity.ok(mascotas);
        }
    }

    @GetMapping("/getMascotasPorIdUsuario/{idUsuario}")
    public ResponseEntity<Object> getMascotasPorIdUsuario(@PathVariable Long idUsuario) {
        List<Mascota> mascotas = mascotaService.getMascotasPorIdUsuario(idUsuario);

        if (mascotas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiError("No se encontraron mascotas para el usuario con ID: " + idUsuario));
        } else {
            return ResponseEntity.ok(mascotas);
        }
    }

    @GetMapping("/verificarPropietario/{idMascota}")
    public ResponseEntity<Object> verificarPropietario(@PathVariable Long idMascota) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getDetails();

        boolean esPropietario = mascotaService.esPropietarioDeMascota(userDetails.getIdUsuario(), idMascota);

        if (esPropietario) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiError("No tiene acceso a esta mascota."));
        }
    }

    // AÑADIR PARA BUSCAR MASCOTAS

    @PostMapping("/create")
    public ResponseEntity<Object> createMascota(@RequestBody Mascota mascota) {
        Optional<Mascota> mascotaCreada = mascotaService.createMascota(mascota);

        if (mascotaCreada.isPresent()) {
            return ResponseEntity.ok(mascotaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(new ApiError("Ya existe una mascota con el número de chip: " + mascota.getNumChip()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateMascota(@PathVariable Long id, @RequestBody Mascota mascota) {
        Optional<Mascota> mascotaModificada = mascotaService.updateMascota(id, mascota);

        if (mascotaModificada.isPresent()) {
            return ResponseEntity.ok(mascotaModificada.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiError("No se pudo actualizar. Mascota no encontrada o número de chip duplicado."));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteMascota(@PathVariable Long id) {
        boolean mascotaEliminada = mascotaService.deleteMascota(id);
        if (mascotaEliminada) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiError("Mascota no encontrada con ID: " + id));
        }
    }
}
