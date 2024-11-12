package com.uoc.tfm.vds_backend.acceso_temporal.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uoc.tfm.vds_backend.acceso_temporal.model.AccesoTemporal;
import com.uoc.tfm.vds_backend.acceso_temporal.repository.AccesoTemporalRepository;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;

@Service
public class AccesoTemporalService {
    @Autowired
    private AccesoTemporalRepository accesoTemporalRepository;

    public AccesoTemporal generarAccesoTemporal(Usuario usuario, Mascota mascota, String tipo, LocalDateTime fechaExpiracion) {
        AccesoTemporal acceso = new AccesoTemporal();
        acceso.setToken(UUID.randomUUID().toString()); // Generamos un token único
        acceso.setFechaExpiracion(fechaExpiracion);
        acceso.setUsuario(usuario);
        acceso.setMascota(mascota);
        accesoTemporalRepository.save(acceso);
        return acceso;
    }

    public Optional<AccesoTemporal> validarToken(String token) {
        return accesoTemporalRepository.findByToken(token)
            .filter(acceso -> acceso.getFechaExpiracion().isAfter(LocalDateTime.now()));
    }
}
