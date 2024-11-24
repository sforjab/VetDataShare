package com.uoc.tfm.vds_backend.clinica.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uoc.tfm.vds_backend.clinica.dto.ClinicaDTO;
import com.uoc.tfm.vds_backend.clinica.service.ClinicaService;
import com.uoc.tfm.vds_backend.error.ApiError;

@RestController
@RequestMapping("/api/clinicas")
public class ClinicaController {

    @Autowired
    ClinicaService clinicaService;

    @GetMapping("/getClinicaPorId/{id}")
    public ResponseEntity<Object> getClinicaPorId(@PathVariable Long id) {
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

    @PostMapping("/create")
    public ResponseEntity<Object> createClinica(@RequestBody ClinicaDTO clinicaDTO) {
        Optional<ClinicaDTO> clinicaCreada = clinicaService.createClinica(clinicaDTO);

        if (clinicaCreada.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(clinicaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Error al crear la clínica. Nombre ya en uso."));
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
}
