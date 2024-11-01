package com.uoc.tfm.vds_backend.consulta.controller;

import java.time.LocalDateTime;
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

import com.uoc.tfm.vds_backend.consulta.model.Consulta;
import com.uoc.tfm.vds_backend.consulta.service.ConsultaService;
import com.uoc.tfm.vds_backend.error.ApiError;


public class ConsultaController {
    @Autowired
    private ConsultaService consultaService;

    // Obtener consulta por ID
    @GetMapping("/getConsultaPorId/{id}")
    public ResponseEntity<Object> getConsultaPorId(@PathVariable Long id) {
        Optional<Consulta> consulta = consultaService.getConsultaPorId(id);

        if (consulta.isPresent()) {
            return ResponseEntity.ok(consulta.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Consulta no encontrada con ID: " + id));
        }
    }

    @GetMapping("/getConsultasPorFecha/{fecha}")
    public ResponseEntity<Object> getConsultasPorFecha(@PathVariable String fecha) {
        try {
            LocalDateTime fechaConsulta = LocalDateTime.parse(fecha); // Conversión de String a LocalDateTime
            List<Consulta> consultas = consultaService.getConsultasPorFecha(fechaConsulta);

            if (consultas.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(new ApiError("No se encontraron consultas para la fecha: " + fecha));
            } else {
                return ResponseEntity.ok(consultas);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(new ApiError("Formato de fecha inválido: " + fecha));
        }
    }

    @GetMapping("/getConsultasPorIdMascota/{idMascota}")
    public ResponseEntity<Object> getConsultasPorIdMascota(@PathVariable Long idMascota) {
        List<Consulta> consultas = consultaService.getConsultasPorIdMascota(idMascota);

        if (consultas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("No se encontraron consultas para la mascota con ID: " + idMascota));
        } else {
            return ResponseEntity.ok(consultas);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createConsulta(@RequestBody Consulta consulta) {
        Optional<Consulta> consultaCreada = consultaService.createConsulta(consulta);

        if (consultaCreada.isPresent()) {
            return ResponseEntity.ok(consultaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(new ApiError("Error al crear la consulta."));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateConsulta(@PathVariable Long id, @RequestBody Consulta consulta) {
        Optional<Consulta> consultaModificada = consultaService.updateConsulta(id, consulta);

        if (consultaModificada.isPresent()) {
            return ResponseEntity.ok(consultaModificada.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("No se pudo actualizar. Consulta no encontrada."));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteConsulta(@PathVariable Long id) {
        boolean consultaEliminada = consultaService.deleteConsulta(id);

        if (consultaEliminada) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Consulta no encontrada con ID: " + id));
        }
    }
}
