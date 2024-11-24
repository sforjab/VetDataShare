package com.uoc.tfm.vds_backend.acceso_temporal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActualizarAccesoRequest {
    private String token;
    private String numColegiado;
    private String fechaExpiracion;
}