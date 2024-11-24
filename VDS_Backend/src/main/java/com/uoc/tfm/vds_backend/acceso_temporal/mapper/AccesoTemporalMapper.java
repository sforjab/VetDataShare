package com.uoc.tfm.vds_backend.acceso_temporal.mapper;

import com.uoc.tfm.vds_backend.acceso_temporal.dto.AccesoTemporalDTO;
import com.uoc.tfm.vds_backend.acceso_temporal.model.AccesoTemporal;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;

import org.springframework.stereotype.Component;

@Component
public class AccesoTemporalMapper {

    public AccesoTemporalDTO toDTO(AccesoTemporal entity) {
        AccesoTemporalDTO dto = new AccesoTemporalDTO();
        dto.setId(entity.getId());
        dto.setToken(entity.getToken());
        dto.setFechaExpiracion(entity.getFechaExpiracion());
        dto.setNumColegiado(entity.getNumColegiado());
        dto.setUsuarioId(entity.getUsuario().getId());
        dto.setMascotaId(entity.getMascota().getId());
        return dto;
    }

    // Nuevo método toEntity que acepta Usuario y Mascota
    public AccesoTemporal toEntity(AccesoTemporalDTO dto, Usuario usuario, Mascota mascota) {
        AccesoTemporal entity = new AccesoTemporal();
        entity.setToken(dto.getToken());
        entity.setFechaExpiracion(dto.getFechaExpiracion());
        entity.setNumColegiado(dto.getNumColegiado());
        entity.setUsuario(usuario); // Asignar el Usuario ya gestionado por JPA
        entity.setMascota(mascota); // Asignar la Mascota ya gestionada por JPA
        return entity;
    }

    // Método toEntity existente (para compatibilidad si se usa en otros casos)
    public AccesoTemporal toEntity(AccesoTemporalDTO dto) {
        AccesoTemporal entity = new AccesoTemporal();
        entity.setToken(dto.getToken());
        entity.setFechaExpiracion(dto.getFechaExpiracion());
        entity.setNumColegiado(dto.getNumColegiado());
        // Usuario y Mascota deben asignarse fuera de este método
        return entity;
    }
}

