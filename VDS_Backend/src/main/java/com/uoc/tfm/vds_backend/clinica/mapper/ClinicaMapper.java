package com.uoc.tfm.vds_backend.clinica.mapper;

import com.uoc.tfm.vds_backend.clinica.dto.ClinicaDTO;
import com.uoc.tfm.vds_backend.clinica.model.Clinica;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ClinicaMapper {
    public ClinicaDTO toDTO(Clinica entity) {
        ClinicaDTO dto = new ClinicaDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDireccion(entity.getDireccion());
        dto.setTelefono(entity.getTelefono());
        dto.setEmail(entity.getEmail());
        dto.setActivo(entity.isActivo());
        dto.setVeterinarioIds(entity.getVeterinarios().stream().map(v -> v.getId()).collect(Collectors.toList()));
        return dto;
    }

    public Clinica toEntity(ClinicaDTO dto) {
        Clinica entity = new Clinica();
        entity.setNombre(dto.getNombre());
        entity.setDireccion(dto.getDireccion());
        entity.setTelefono(dto.getTelefono());
        entity.setEmail(dto.getEmail());
        entity.setActivo(dto.isActivo());
        // Veterinarios deben configurarse fuera del mapper.
        return entity;
    }
}
