package com.uoc.tfm.vds_backend.clinica.controller;

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

import com.uoc.tfm.vds_backend.clinica.model.Clinica;
import com.uoc.tfm.vds_backend.clinica.service.ClinicaService;
import com.uoc.tfm.vds_backend.error.ApiError;

@RestController
@RequestMapping("/api/clinicas")
public class ClinicaController {

    @Autowired
    ClinicaService clinicaService;

    @GetMapping("/getClinicaPorId/{id}")
    public ResponseEntity<Object> getClinicaPorId(@PathVariable Long id) {
        Optional<Clinica> clinica = clinicaService.getClinicaPorId(id);

        if (clinica.isPresent()) {
            return ResponseEntity.ok(clinica.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Clínica no encontrada con ID: " + id));
        }
    }

    @GetMapping("/getClinicaPorNombre/{nombre}")
    public ResponseEntity<Object> getClinicaPorNombre(@PathVariable String nombre) {
        Optional<Clinica> clinica = clinicaService.getClinicaPorNombre(nombre);

        if (clinica.isPresent()) {
            return ResponseEntity.ok(clinica.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Clínica no encontrada con nombre: " + nombre));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createClinica(@RequestBody Clinica clinica) {
        Optional<Clinica> clinicaCreada = clinicaService.createClinica(clinica);

        if (clinicaCreada.isPresent()) {
            return ResponseEntity.ok(clinicaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Error al crear la clínica. Nombre ya en uso."));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateClinica(@PathVariable Long id, @RequestBody Clinica clinica) {
        Optional<Clinica> clinicaModificada = clinicaService.updateClinica(id, clinica);

        if (clinicaModificada.isPresent()) {
            return ResponseEntity.ok(clinicaModificada.get());
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
