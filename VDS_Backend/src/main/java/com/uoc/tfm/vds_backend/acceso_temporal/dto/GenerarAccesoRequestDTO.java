package com.uoc.tfm.vds_backend.acceso_temporal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenerarAccesoRequestDTO {
    private Long usuarioId;
    private Long mascotaId;
}
