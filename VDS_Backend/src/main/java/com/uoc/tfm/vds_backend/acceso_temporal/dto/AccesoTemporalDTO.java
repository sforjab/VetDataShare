package com.uoc.tfm.vds_backend.acceso_temporal.dto;

import java.time.ZonedDateTime;

import lombok.Data;

@Data
public class AccesoTemporalDTO {
    private Long id;
    private String token;
    private ZonedDateTime fechaExpiracion;
    private String numColegiado;
    private Long usuarioId;
    private Long mascotaId;
}
