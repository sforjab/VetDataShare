package com.uoc.tfm.vds_backend.prueba.controller;
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
import com.uoc.tfm.vds_backend.prueba.model.Prueba;
import com.uoc.tfm.vds_backend.prueba.service.PruebaService;

@RestController
@RequestMapping("/api/pruebas")
public class PruebaController {

    @Autowired
    PruebaService pruebaService;

    @GetMapping("/getPruebaPorId/{id}")
    public ResponseEntity<Object> getPruebaPorId(@PathVariable Long id) {
        Optional<Prueba> prueba = pruebaService.getPruebaPorId(id);

        if (prueba.isPresent()) {
            return ResponseEntity.ok(prueba.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Prueba no encontrada con ID: " + id));
        }
    }

    @GetMapping("/getPruebasPorIdMascota/{id}")
    public ResponseEntity<Object> getPruebasPorIdMascota(@PathVariable Long id) {
        List<Prueba> pruebas = pruebaService.getPruebasPorIdMascota(id);

        if (pruebas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("No se encontraron pruebas para la mascota con ID: " + id));
        } else {
            return ResponseEntity.ok(pruebas);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createPrueba(@RequestBody Prueba prueba) {
        Optional<Prueba> pruebaCreada = pruebaService.createPrueba(prueba);

        if (pruebaCreada.isPresent()) {
            return ResponseEntity.ok(pruebaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(new ApiError("Error al crear la prueba."));
        }
    }

    // Actualizar una prueba existente
    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updatePrueba(@PathVariable Long id, @RequestBody Prueba prueba) {
        Optional<Prueba> pruebaModificada = pruebaService.updatePrueba(id, prueba);

        if (pruebaModificada.isPresent()) {
            return ResponseEntity.ok(pruebaModificada.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("No se pudo actualizar. Prueba no encontrada."));
        }
    }

    // Eliminar una prueba por su ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deletePrueba(@PathVariable Long id) {
        boolean pruebaEliminada = pruebaService.delete(id);

        if (pruebaEliminada) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Prueba no encontrada con ID: " + id));
        }
    }
}
