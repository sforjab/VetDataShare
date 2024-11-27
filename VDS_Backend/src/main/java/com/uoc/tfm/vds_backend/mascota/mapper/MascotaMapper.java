package com.uoc.tfm.vds_backend.mascota.mapper;

import com.uoc.tfm.vds_backend.clinica.model.Clinica;
import com.uoc.tfm.vds_backend.mascota.dto.MascotaDTO;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class MascotaMapper {
    public MascotaDTO toDTO(Mascota entity) {
        MascotaDTO dto = new MascotaDTO();
        dto.setId(entity.getId());
        dto.setFechaAlta(entity.getFechaAlta());
        dto.setNumChip(entity.getNumChip());
        dto.setNombre(entity.getNombre());
        dto.setEspecie(entity.getEspecie());
        dto.setRaza(entity.getRaza());
        dto.setSexo(entity.getSexo());
        dto.setFechaNacimiento(entity.getFechaNacimiento());
        dto.setPropietarioId(entity.getUsuario().getId());
        dto.setConsultaIds(entity.getConsultas().stream().map(c -> c.getId()).collect(Collectors.toList()));
        dto.setPruebaIds(entity.getPruebas().stream().map(p -> p.getId()).collect(Collectors.toList()));
        dto.setVacunaIds(entity.getVacunas().stream().map(v -> v.getId()).collect(Collectors.toList()));
        dto.setClinicaId(entity.getClinica() != null ? entity.getClinica().getId() : null);
        return dto;
    }

    public Mascota toEntity(MascotaDTO dto) {
        Mascota entity = new Mascota();
        entity.setFechaAlta(dto.getFechaAlta());
        entity.setNumChip(dto.getNumChip());
        entity.setNombre(dto.getNombre());
        entity.setEspecie(dto.getEspecie());
        entity.setRaza(dto.getRaza());
        entity.setSexo(dto.getSexo());
        entity.setFechaNacimiento(dto.getFechaNacimiento());
        if (dto.getClinicaId() != null) {
            Clinica clinica = new Clinica();
            clinica.setId(dto.getClinicaId());
            entity.setClinica(clinica);
        }
        return entity;
    }
}
