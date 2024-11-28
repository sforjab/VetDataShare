package com.uoc.tfm.vds_backend.prueba.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.prueba.dto.DocumentoPruebaDTO;
import com.uoc.tfm.vds_backend.prueba.mapper.DocumentoPruebaMapper;
import com.uoc.tfm.vds_backend.prueba.model.DocumentoPrueba;
import com.uoc.tfm.vds_backend.prueba.model.Prueba;
import com.uoc.tfm.vds_backend.prueba.repository.DocumentoPruebaRepository;
import com.uoc.tfm.vds_backend.prueba.repository.PruebaRepository;

@Service
public class DocumentoPruebaService {

    @Autowired
    private DocumentoPruebaRepository documentoPruebaRepository;

    @Autowired
    private DocumentoPruebaMapper documentoPruebaMapper;

    @Autowired
    private PruebaRepository pruebaRepository;

    @Transactional
    public Optional<DocumentoPruebaDTO> getDocumentoPorId(Long id) {
        return documentoPruebaRepository.findById(id)
                .map(documentoPruebaMapper::toDTO);
    }

    @Transactional
    public List<DocumentoPruebaDTO> getDocumentosPorPruebaId(Long pruebaId) {
        return documentoPruebaRepository.findByPruebaId(pruebaId).stream()
                .map(documentoPruebaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
public Optional<DocumentoPruebaDTO> create(DocumentoPruebaDTO documentoPruebaDTO) {
    try {
        if (documentoPruebaRepository.existsByNombreArchivoAndPruebaId(
                documentoPruebaDTO.getNombreArchivo(), documentoPruebaDTO.getPruebaId())) {
            return Optional.empty(); // Documento duplicado
        }

        DocumentoPrueba documento = documentoPruebaMapper.toEntity(documentoPruebaDTO);

        Prueba prueba = pruebaRepository.findById(documentoPruebaDTO.getPruebaId())
            .orElseThrow(() -> new IllegalArgumentException("Prueba no encontrada con ID: " + documentoPruebaDTO.getPruebaId()));

        documento.setPrueba(prueba);

        DocumentoPrueba documentoGuardado = documentoPruebaRepository.save(documento);

        return Optional.of(documentoPruebaMapper.toDTO(documentoGuardado));
    } catch (Exception e) {
        e.printStackTrace(); // Solo para depuración, evita esto en producción
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