package com.uoc.tfm.vds_backend.prueba.controller;

import com.uoc.tfm.vds_backend.prueba.dto.DocumentoPruebaDTO;
import com.uoc.tfm.vds_backend.prueba.service.DocumentoPruebaService;
import com.uoc.tfm.vds_backend.error.ApiError;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documentos-prueba")
public class DocumentoPruebaController {

    @Autowired
    private DocumentoPruebaService documentoPruebaService;

    @GetMapping("/getDocumentoPorId/{id}")
    public ResponseEntity<Object> getDocumentoPorId(@PathVariable Long id) {
        Optional<DocumentoPruebaDTO> documentoPruebaDTO = documentoPruebaService.getDocumentoPorId(id);

        if (documentoPruebaDTO.isPresent()) {
            return ResponseEntity.ok(documentoPruebaDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Documento de prueba no encontrado con ID: " + id));
        }
    }

    @GetMapping("/getDocumentosPorPruebaId/{pruebaId}")
    public ResponseEntity<List<DocumentoPruebaDTO>> getDocumentosPorPruebaId(@PathVariable Long pruebaId) {
        List<DocumentoPruebaDTO> documentos = documentoPruebaService.getDocumentosPorPruebaId(pruebaId);
        return ResponseEntity.ok(documentos);
    }

    @PostMapping("/subirDocumento")
    public ResponseEntity<?> subirDocumento(@RequestParam("file") MultipartFile file, @RequestParam("pruebaId") Long pruebaId) {
        try {
            DocumentoPruebaDTO documentoPruebaDTO = new DocumentoPruebaDTO();
            documentoPruebaDTO.setNombreArchivo(file.getOriginalFilename());
            documentoPruebaDTO.setTipoArchivo(file.getContentType());
            documentoPruebaDTO.setDatos(file.getBytes());
            documentoPruebaDTO.setPruebaId(pruebaId);

            Optional<DocumentoPruebaDTO> documentoGuardado = documentoPruebaService.create(documentoPruebaDTO);

            if (documentoGuardado.isPresent()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(documentoGuardado.get());
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiError("Error al guardar el documento."));
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Error al procesar el archivo."));
        }
    }


    @GetMapping("/descargarDocumento/{id}")
    public ResponseEntity<byte[]> descargarDocumento(@PathVariable Long id) {
        Optional<DocumentoPruebaDTO> documento = documentoPruebaService.getDocumentoPorId(id);

        if (documento.isPresent()) {
            DocumentoPruebaDTO doc = documento.get();
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + doc.getNombreArchivo() + "\"")
                    .contentType(org.springframework.http.MediaType.valueOf(doc.getTipoArchivo()))
                    .body(doc.getDatos());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createDocumentoPrueba(@RequestBody DocumentoPruebaDTO documentoPruebaDTO) {
        Optional<DocumentoPruebaDTO> documentoCreado = documentoPruebaService.create(documentoPruebaDTO);

        if (documentoCreado.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(documentoCreado.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Error al crear el documento de prueba. Puede que ya exista con el mismo nombre."));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteDocumentoPrueba(@PathVariable Long id) {
        if (documentoPruebaService.delete(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Documento de prueba no encontrado con ID: " + id));
        }
    }
}
