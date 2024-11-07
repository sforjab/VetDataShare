package com.uoc.tfm.vds_backend.auth.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String rol;
    private Long idUsuario;
}
