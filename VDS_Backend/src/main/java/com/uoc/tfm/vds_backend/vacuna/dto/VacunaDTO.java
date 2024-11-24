package com.uoc.tfm.vds_backend.vacuna.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class VacunaDTO {
    private Long id;
    private String nombre;      
    private String laboratorio;
    private LocalDate fecha;
    private Long mascotaId;
    private Long consultaId;
}
