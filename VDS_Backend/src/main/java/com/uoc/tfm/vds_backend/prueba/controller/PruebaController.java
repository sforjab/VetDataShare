package com.uoc.tfm.vds_backend.prueba.controller;

import com.uoc.tfm.vds_backend.prueba.dto.PruebaDTO;
import com.uoc.tfm.vds_backend.prueba.service.PruebaService;
import com.uoc.tfm.vds_backend.error.ApiError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pruebas")
public class PruebaController {

    @Autowired
    private PruebaService pruebaService;


    @GetMapping("/getPruebaPorId/{id}")
    public ResponseEntity<Object> getPruebaPorId(@PathVariable Long id) {
        Optional<PruebaDTO> pruebaDTO = pruebaService.getPruebaPorId(id);

        if (pruebaDTO.isPresent()) {
            return ResponseEntity.ok(pruebaDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Prueba no encontrada con ID: " + id));
        }
    }

    @GetMapping("/getPruebasPorIdMascota/{idMascota}")
    public ResponseEntity<List<PruebaDTO>> getPruebasPorIdMascota(@PathVariable Long idMascota) {
        List<PruebaDTO> pruebas = pruebaService.getPruebasPorIdMascota(idMascota);
        return ResponseEntity.ok(pruebas);
    }

    @GetMapping("/getPruebasPorConsultaId/{idConsulta}")
    public ResponseEntity<List<PruebaDTO>> getPruebasPorConsultaId(@PathVariable Long idConsulta) {
        List<PruebaDTO> pruebas = pruebaService.getPruebasPorConsultaId(idConsulta);
        return ResponseEntity.ok(pruebas);
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createPrueba(@RequestBody PruebaDTO pruebaDTO) {
        Optional<PruebaDTO> pruebaCreada = pruebaService.createPrueba(pruebaDTO);

        if (pruebaCreada.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(pruebaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Error al crear la prueba."));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updatePrueba(@PathVariable Long id, @RequestBody PruebaDTO pruebaDTO) {
        Optional<PruebaDTO> pruebaActualizada = pruebaService.updatePrueba(id, pruebaDTO);

        if (pruebaActualizada.isPresent()) {
            return ResponseEntity.ok(pruebaActualizada.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Prueba no encontrada con ID: " + id));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deletePrueba(@PathVariable Long id) {
        if (pruebaService.delete(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Prueba no encontrada con ID: " + id));
        }
    }
}
