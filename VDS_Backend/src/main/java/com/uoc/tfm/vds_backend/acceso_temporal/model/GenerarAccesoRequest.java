package com.uoc.tfm.vds_backend.acceso_temporal.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GenerarAccesoRequest {
    private Long usuarioId;  // ID del usuario que genera el acceso
    private Long mascotaId;  // ID de la mascota asociada al acceso
    private String tipo;     // Tipo de acceso (QR o numérico)
}

