package com.uoc.tfm.vds_backend.mascota.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class MascotaDTO {
    private Long id;
    private LocalDateTime fechaAlta;
    private String numChip;
    private String nombre;
    private String especie;
    private String raza;
    private String sexo;
    private LocalDate fechaNacimiento;
    private Long propietarioId;
    private List<Long> consultaIds;
    private List<Long> pruebaIds;
    private List<Long> vacunaIds;
    private Long clinicaId;
    
}
