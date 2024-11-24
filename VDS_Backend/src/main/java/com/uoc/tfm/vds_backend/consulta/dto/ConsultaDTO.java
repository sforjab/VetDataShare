package com.uoc.tfm.vds_backend.consulta.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class ConsultaDTO {
    private Long id;
    private LocalDateTime fechaConsulta;
    private String motivo;
    private String notas;
    private String medicacion;
    private Long mascotaId;
    private Long veterinarioId;
    private List<Long> pruebaIds;
    private List<Long> vacunaIds;
}
