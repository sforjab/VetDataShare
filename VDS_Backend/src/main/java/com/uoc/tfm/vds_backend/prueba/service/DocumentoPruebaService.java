package com.uoc.tfm.vds_backend.prueba.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.prueba.model.DocumentoPrueba;
import com.uoc.tfm.vds_backend.prueba.repository.DocumentoPruebaRepository;

@Service
public class DocumentoPruebaService {
    @Autowired
    private DocumentoPruebaRepository documentoPruebaRepository;

    public Optional<DocumentoPrueba> getDocumentoPorId(Long id) {
        return documentoPruebaRepository.findById(id);
    }

    @Transactional
    public Optional<DocumentoPrueba> create(DocumentoPrueba documento) {
        try {
            if (documentoPruebaRepository.existsByNombreArchivoAndPruebaId(documento.getNombreArchivo(), documento.getPrueba().getId())) {
                return Optional.empty(); // Un documento con el mismo nombre ya existe para esta prueba
            }

            DocumentoPrueba documentoGuardado = documentoPruebaRepository.save(documento);
            return Optional.of(documentoGuardado);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public boolean delete(Long id) {
        try {
            if (documentoPruebaRepository.existsById(id)) {
                documentoPruebaRepository.deleteById(id);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

}
