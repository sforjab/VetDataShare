package com.uoc.tfm.vds_backend.prueba.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.prueba.dto.DocumentoPruebaDTO;
import com.uoc.tfm.vds_backend.prueba.mapper.DocumentoPruebaMapper;
import com.uoc.tfm.vds_backend.prueba.model.DocumentoPrueba;
import com.uoc.tfm.vds_backend.prueba.repository.DocumentoPruebaRepository;

@Service
public class DocumentoPruebaService {

    @Autowired
    private DocumentoPruebaRepository documentoPruebaRepository;

    @Autowired
    private DocumentoPruebaMapper documentoPruebaMapper;

    @Transactional
    public Optional<DocumentoPruebaDTO> getDocumentoPorId(Long id) {
        return documentoPruebaRepository.findById(id)
                .map(documentoPruebaMapper::toDTO);
    }

    @Transactional
    public Optional<DocumentoPruebaDTO> create(DocumentoPruebaDTO documentoPruebaDTO) {
        try {
            if (documentoPruebaRepository.existsByNombreArchivoAndPruebaId(
                    documentoPruebaDTO.getNombreArchivo(), documentoPruebaDTO.getPruebaId())) {
                return Optional.empty(); // Documento duplicado
            }

            DocumentoPrueba documento = documentoPruebaMapper.toEntity(documentoPruebaDTO);
            DocumentoPrueba documentoGuardado = documentoPruebaRepository.save(documento);
            return Optional.of(documentoPruebaMapper.toDTO(documentoGuardado));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public boolean delete(Long id) {
        if (documentoPruebaRepository.existsById(id)) {
            documentoPruebaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}