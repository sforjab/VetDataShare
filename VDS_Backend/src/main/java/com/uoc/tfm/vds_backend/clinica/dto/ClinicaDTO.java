package com.uoc.tfm.vds_backend.clinica.dto;

import java.util.List;

import lombok.Data;

@Data
public class ClinicaDTO {
    private Long id;
    private String nombre;
    private String direccion;
    private String telefono;
    private String email;
    private boolean activo;
    private List<Long> veterinarioIds;
}
