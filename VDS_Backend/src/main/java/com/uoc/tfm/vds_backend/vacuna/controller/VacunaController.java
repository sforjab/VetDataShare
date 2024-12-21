package com.uoc.tfm.vds_backend.vacuna.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uoc.tfm.vds_backend.error.ApiError;
import com.uoc.tfm.vds_backend.vacuna.dto.VacunaDTO;
import com.uoc.tfm.vds_backend.vacuna.service.VacunaService;

@RestController
@RequestMapping("/api/vacunas")
public class VacunaController {

    @Autowired
    VacunaService vacunaService;

    @GetMapping("/getVacunaPorId/{id}")
    public ResponseEntity<Object> getVacunaPorId(@PathVariable Long id) {
        Optional<VacunaDTO> vacunaDTO = vacunaService.getVacunaPorId(id);

        if (vacunaDTO.isPresent()) {
            return ResponseEntity.ok(vacunaDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Vacuna no encontrada con ID: " + id));
        }
    }

    @GetMapping("/getVacunasPorIdMascota/{idMascota}")
    public ResponseEntity<List<VacunaDTO>> getVacunasPorIdMascota(@PathVariable Long idMascota) {
        List<VacunaDTO> vacunas = vacunaService.getVacunasPorIdMascota(idMascota);
        return ResponseEntity.ok(vacunas);
    }

    @GetMapping("/getUltimasVacunas/{idMascota}")
    public ResponseEntity<List<VacunaDTO>> getUltimasVacunas(@PathVariable Long idMascota) {
        List<VacunaDTO> ultimasVacunas = vacunaService.getUltimasVacunas(idMascota);
        return ResponseEntity.ok(ultimasVacunas);
    }

    @GetMapping("/getVacunasPorConsultaId/{consultaId}")
    public ResponseEntity<List<VacunaDTO>> getVacunasPorConsultaId(@PathVariable Long consultaId) {
        List<VacunaDTO> vacunas = vacunaService.getVacunasPorConsultaId(consultaId);
        if (vacunas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(vacunas);
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createVacuna(@RequestBody VacunaDTO vacunaDTO) {
        Optional<VacunaDTO> vacunaCreada = vacunaService.createVacuna(vacunaDTO);

        if (vacunaCreada.isPresent()) {
            return ResponseEntity.ok(vacunaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Error al crear la vacuna."));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateVacuna(@PathVariable Long id, @RequestBody VacunaDTO vacunaDTO) {
        Optional<VacunaDTO> vacunaModificada = vacunaService.updateVacuna(id, vacunaDTO);

        if (vacunaModificada.isPresent()) {
            return ResponseEntity.ok(vacunaModificada.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("No se pudo actualizar. Vacuna no encontrada."));
        }
    }

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
