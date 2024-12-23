package com.uoc.tfm.vds_backend.jwt;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(rol));
    }

    @Override
    public String getPassword() {
        return null; // No lo necesitas para JWT
    }

    @Override
    public String getUsername() {
        return idUsuario != null ? idUsuario.toString() : null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
