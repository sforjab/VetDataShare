package com.uoc.tfm.vds_backend.usuario.mapper;

import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.usuario.dto.UsuarioDTO;
import com.uoc.tfm.vds_backend.usuario.model.Rol;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class UsuarioMapper {
    public UsuarioDTO toDTO(Usuario entity) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(entity.getId());
        dto.setNumIdent(entity.getNumIdent());
        dto.setNumColegiado(entity.getNumColegiado());
        dto.setNombre(entity.getNombre());
        dto.setApellido1(entity.getApellido1());
        dto.setApellido2(entity.getApellido2());
        dto.setDireccion(entity.getDireccion());
        dto.setTelefono(entity.getTelefono());
        dto.setEmail(entity.getEmail());
        dto.setRol(entity.getRol().name());
        dto.setUsername(entity.getUsername());
        /* dto.setClinicaId(entity.getClinica() != null ? entity.getClinica().getId() : null);
        dto.setMascotaIds(entity.getMascotas().stream().map(m -> m.getId()).collect(Collectors.toList())); */
        // Mapeo de la clínica
        if (entity.getClinica() != null) {
            dto.setClinicaId(entity.getClinica().getId());
        } else {
            dto.setClinicaId(null);
        }

        // Mapeo de las mascotas
        dto.setMascotaIds(
            entity.getMascotas() != null
                ? entity.getMascotas().stream()
                    .map(Mascota::getId)
                    .collect(Collectors.toList())
                : new ArrayList<>()
        );

        return dto;
    }

    public Usuario toEntity(UsuarioDTO dto) {
        Usuario entity = new Usuario();
        entity.setNumIdent(dto.getNumIdent());
        entity.setNumColegiado(dto.getNumColegiado());
        entity.setNombre(dto.getNombre());
        entity.setApellido1(dto.getApellido1());
        entity.setApellido2(dto.getApellido2());
        entity.setDireccion(dto.getDireccion());
        entity.setTelefono(dto.getTelefono());
        entity.setEmail(dto.getEmail());
        entity.setRol(Rol.valueOf(dto.getRol()));
        entity.setUsername(dto.getUsername());
        // Mascotas y clínica deben configurarse fuera del mapper.
        return entity;
    }
}
