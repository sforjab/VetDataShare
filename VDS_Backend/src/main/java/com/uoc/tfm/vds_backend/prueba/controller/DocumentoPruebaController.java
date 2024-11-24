package com.uoc.tfm.vds_backend.prueba.controller;

import com.uoc.tfm.vds_backend.prueba.dto.DocumentoPruebaDTO;
import com.uoc.tfm.vds_backend.prueba.service.DocumentoPruebaService;
import com.uoc.tfm.vds_backend.error.ApiError;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/documentos-prueba")
public class DocumentoPruebaController {

    @Autowired
    private DocumentoPruebaService documentoPruebaService;

    @GetMapping("/{id}")
    public ResponseEntity<Object> getDocumentoPorId(@PathVariable Long id) {
        Optional<DocumentoPruebaDTO> documentoPruebaDTO = documentoPruebaService.getDocumentoPorId(id);

        if (documentoPruebaDTO.isPresent()) {
            return ResponseEntity.ok(documentoPruebaDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Documento de prueba no encontrado con ID: " + id));
        }
    }

    @PostMapping
    public ResponseEntity<Object> createDocumentoPrueba(@RequestBody DocumentoPruebaDTO documentoPruebaDTO) {
        Optional<DocumentoPruebaDTO> documentoCreado = documentoPruebaService.create(documentoPruebaDTO);

        if (documentoCreado.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(documentoCreado.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Error al crear el documento de prueba. Puede que ya exista con el mismo nombre."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteDocumentoPrueba(@PathVariable Long id) {
        if (documentoPruebaService.delete(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Documento de prueba no encontrado con ID: " + id));
        }
    }
}
