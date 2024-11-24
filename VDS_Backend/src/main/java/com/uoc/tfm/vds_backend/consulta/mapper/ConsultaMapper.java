package com.uoc.tfm.vds_backend.consulta.mapper;

import com.uoc.tfm.vds_backend.consulta.dto.ConsultaDTO;
import com.uoc.tfm.vds_backend.consulta.model.Consulta;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ConsultaMapper {
    public ConsultaDTO toDTO(Consulta entity) {
        ConsultaDTO dto = new ConsultaDTO();
        dto.setId(entity.getId());
        dto.setFechaConsulta(entity.getFechaConsulta());
        dto.setMotivo(entity.getMotivo());
        dto.setNotas(entity.getNotas());
        dto.setMedicacion(entity.getMedicacion());
        dto.setMascotaId(entity.getMascota().getId());
        dto.setVeterinarioId(entity.getVeterinario().getId());
        dto.setPruebaIds(entity.getPruebas().stream().map(p -> p.getId()).collect(Collectors.toList()));
        dto.setVacunaIds(entity.getVacunas().stream().map(v -> v.getId()).collect(Collectors.toList()));
        return dto;
    }

    public Consulta toEntity(ConsultaDTO dto) {
        Consulta entity = new Consulta();
        entity.setFechaConsulta(dto.getFechaConsulta());
        entity.setMotivo(dto.getMotivo());
        entity.setNotas(dto.getNotas());
        entity.setMedicacion(dto.getMedicacion());
        // Mascota y Veterinario deben configurarse fuera del mapper.
        return entity;
    }
}
