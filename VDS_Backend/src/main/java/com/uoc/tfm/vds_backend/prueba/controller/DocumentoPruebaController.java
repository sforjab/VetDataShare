package com.uoc.tfm.vds_backend.prueba.controller;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uoc.tfm.vds_backend.error.ApiError;
import com.uoc.tfm.vds_backend.prueba.model.DocumentoPrueba;
import com.uoc.tfm.vds_backend.prueba.service.DocumentoPruebaService;

@RestController
@RequestMapping("/api/documentos-prueba")
public class DocumentoPruebaController {

    @Autowired
    DocumentoPruebaService documentoPruebaService;

    // Obtener un documento por ID
    @GetMapping("/getDocumentoPorId/{id}")
    public ResponseEntity<Object> getDocumentoPorId(@PathVariable Long id) {
        Optional<DocumentoPrueba> documento = documentoPruebaService.getDocumentoPorId(id);

        if (documento.isPresent()) {
            return ResponseEntity.ok(documento.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Documento no encontrado con ID: " + id));
        }
    }

    // Crear un nuevo documento asociado a una prueba
    @PostMapping("/create")
    public ResponseEntity<Object> createDocumento(@RequestBody DocumentoPrueba documento) {
        Optional<DocumentoPrueba> documentoCreado = documentoPruebaService.create(documento);

        if (documentoCreado.isPresent()) {
            return ResponseEntity.ok(documentoCreado.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(new ApiError("Error al crear el documento. El documento ya existe."));
        }
    }

    // Eliminar un documento por ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteDocumento(@PathVariable Long id) {
        boolean documentoEliminado = documentoPruebaService.delete(id);

        if (documentoEliminado) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(new ApiError("Documento no encontrado con ID: " + id));
        }
    }
}
