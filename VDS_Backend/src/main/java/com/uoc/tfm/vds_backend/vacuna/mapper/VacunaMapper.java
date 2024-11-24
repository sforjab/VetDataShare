package com.uoc.tfm.vds_backend.vacuna.mapper;

import com.uoc.tfm.vds_backend.vacuna.dto.VacunaDTO;
import com.uoc.tfm.vds_backend.vacuna.model.Vacuna;
import org.springframework.stereotype.Component;

@Component
public class VacunaMapper {
    public VacunaDTO toDTO(Vacuna entity) {
        VacunaDTO dto = new VacunaDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setLaboratorio(entity.getLaboratorio());
        dto.setFecha(entity.getFecha());
        dto.setMascotaId(entity.getMascota().getId());
        dto.setConsultaId(entity.getConsulta() != null ? entity.getConsulta().getId() : null);
        return dto;
    }

    public Vacuna toEntity(VacunaDTO dto) {
        Vacuna entity = new Vacuna();
        entity.setNombre(dto.getNombre());
        entity.setLaboratorio(dto.getLaboratorio());
        entity.setFecha(dto.getFecha());
        // Mascota y consulta deben configurarse fuera del mapper.
        return entity;
    }
}
