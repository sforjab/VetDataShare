package com.uoc.tfm.vds_backend.jwt;

public class CustomUserDetails {
    private Long idUsuario;
    private Long idMascota;
    private String rol;

    public CustomUserDetails(Long idUsuario, Long idMascota, String rol) {
        this.idUsuario = idUsuario;
        this.idMascota = idMascota;
        this.rol = rol;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public Long getIdMascota() {
        return idMascota;
    }

    public String getRol() {
        return rol;
    }
}
