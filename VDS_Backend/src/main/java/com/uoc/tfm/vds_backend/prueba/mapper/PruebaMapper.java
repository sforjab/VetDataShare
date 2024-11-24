package com.uoc.tfm.vds_backend.prueba.mapper;

import com.uoc.tfm.vds_backend.prueba.dto.PruebaDTO;
import com.uoc.tfm.vds_backend.prueba.model.Prueba;

import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class PruebaMapper {

    public PruebaDTO toDTO(Prueba entity) {
        PruebaDTO dto = new PruebaDTO();
        dto.setId(entity.getId());
        dto.setTipo(entity.getTipo()); 
        dto.setDescripcion(entity.getDescripcion());
        dto.setFecha(entity.getFecha());
        dto.setMascotaId(entity.getMascota().getId());
        dto.setConsultaId(entity.getConsulta() != null ? entity.getConsulta().getId() : null);
        dto.setDocumentoPruebaIds(
                entity.getDocumentosPrueba().stream()
                        .map(documento -> documento.getId())
                        .collect(Collectors.toList())
        );
        return dto;
    }

    public Prueba toEntity(PruebaDTO dto) {
        Prueba entity = new Prueba();
        entity.setTipo(dto.getTipo()); 
        entity.setDescripcion(dto.getDescripcion());
        entity.setFecha(dto.getFecha());
        // Mascota y consulta deben configurarse fuera del mapper.
        return entity;
    }
}
