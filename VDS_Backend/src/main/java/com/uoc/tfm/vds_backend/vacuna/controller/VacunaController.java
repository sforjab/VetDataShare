package com.uoc.tfm.vds_backend.vacuna.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uoc.tfm.vds_backend.error.ApiError;
import com.uoc.tfm.vds_backend.vacuna.model.Vacuna;
import com.uoc.tfm.vds_backend.vacuna.service.VacunaService;

@RestController
@RequestMapping("/api/vacunas")
public class VacunaController {

    @Autowired
    VacunaService vacunaService;

    @GetMapping("/getVacunaPorId/{id}")
    public ResponseEntity<Object> getVacunaPorId(@PathVariable Long id) {
        Optional<Vacuna> vacuna = vacunaService.getVacunaPorId(id);

        if (vacuna.isPresent()) {
            return ResponseEntity.ok(vacuna.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Vacuna no encontrada con ID: " + id));
        }
    }

    @GetMapping("/getVacunasPorIdMascota/{id}")
    public ResponseEntity<Object> getVacunasPorIdMascota(@PathVariable Long id) {
        List<Vacuna> vacunas = vacunaService.getVacunasPorIdMascota(id);

        if (vacunas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("No se encontraron vacunas para la mascota con ID: " + id));
        } else {
            return ResponseEntity.ok(vacunas);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createVacuna(@RequestBody Vacuna vacuna) {
        Optional<Vacuna> vacunaCreada = vacunaService.createVacuna(vacuna);

        if (vacunaCreada.isPresent()) {
            return ResponseEntity.ok(vacunaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(new ApiError("Error al crear la vacuna."));
        }
    }

    // Actualizar una vacuna existente
    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateVacuna(@PathVariable Long id, @RequestBody Vacuna vacuna) {
        Optional<Vacuna> vacunaModificada = vacunaService.updatePrueba(id, vacuna);

        if (vacunaModificada.isPresent()) {
            return ResponseEntity.ok(vacunaModificada.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("No se pudo actualizar. Vacuna no encontrada."));
        }
    }

    // Eliminar una vacuna por su ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteVacuna(@PathVariable Long id) {
        boolean vacunaEliminada = vacunaService.delete(id);

        if (vacunaEliminada) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Vacuna no encontrada con ID: " + id));
        }
    }
}

