package com.uoc.tfm.vds_backend.prueba.mapper;

import com.uoc.tfm.vds_backend.prueba.dto.DocumentoPruebaDTO;
import com.uoc.tfm.vds_backend.prueba.model.DocumentoPrueba;
import org.springframework.stereotype.Component;

@Component
public class DocumentoPruebaMapper {
    public DocumentoPruebaDTO toDTO(DocumentoPrueba entity) {
        DocumentoPruebaDTO dto = new DocumentoPruebaDTO();
        dto.setId(entity.getId());
        dto.setNombreArchivo(entity.getNombreArchivo());
        dto.setTipoArchivo(entity.getTipoArchivo());
        dto.setDatos(entity.getDatos());
        dto.setPruebaId(entity.getPrueba().getId());
        return dto;
    }

    public DocumentoPrueba toEntity(DocumentoPruebaDTO dto) {
        DocumentoPrueba entity = new DocumentoPrueba();
        entity.setNombreArchivo(dto.getNombreArchivo());
        entity.setTipoArchivo(dto.getTipoArchivo());
        entity.setDatos(dto.getDatos());
        // Prueba debe configurarse fuera del mapper.
        return entity;
    }
}
