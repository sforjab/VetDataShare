package com.uoc.tfm.vds_backend.usuario.dto;

import java.util.List;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String numIdent;
    private String numColegiado;
    private String nombre;
    private String apellido1;
    private String apellido2;
    private String direccion;
    private String telefono;
    private String email;
    private String rol;
    private String username;
    private String password;
    private Long clinicaId;
    private List<Long> mascotaIds;
}
