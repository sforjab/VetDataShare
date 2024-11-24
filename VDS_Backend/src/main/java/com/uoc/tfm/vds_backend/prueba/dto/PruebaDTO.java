package com.uoc.tfm.vds_backend.prueba.dto;

import java.time.LocalDate;
import java.util.List;

import com.uoc.tfm.vds_backend.prueba.model.TipoPrueba;

import lombok.Data;

@Data
public class PruebaDTO {
    private Long id;
    private TipoPrueba tipo;
    private String descripcion;
    private LocalDate fecha;
    private Long mascotaId;
    private Long consultaId;
    private List<Long> documentoPruebaIds;
}
