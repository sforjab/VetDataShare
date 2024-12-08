package com.uoc.tfm.vds_backend.acceso_temporal.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uoc.tfm.vds_backend.acceso_temporal.dto.AccesoTemporalDTO;
import com.uoc.tfm.vds_backend.acceso_temporal.mapper.AccesoTemporalMapper;
import com.uoc.tfm.vds_backend.acceso_temporal.model.AccesoTemporal;
import com.uoc.tfm.vds_backend.acceso_temporal.repository.AccesoTemporalRepository;
import com.uoc.tfm.vds_backend.jwt.JwtService;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import com.uoc.tfm.vds_backend.usuario.service.UsuarioService;

import jakarta.transaction.Transactional;

@Service
public class AccesoTemporalService {

    @Autowired
    private AccesoTemporalRepository accesoTemporalRepository;

    @Autowired
    private MascotaService mascotaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AccesoTemporalMapper accesoTemporalMapper;

    @Transactional
    public AccesoTemporalDTO generarAccesoTemporal(Long usuarioId, Long mascotaId) {
       // Recuperar la entidad Usuario gestionada por JPA
        Usuario usuario = usuarioService.getEntityById(usuarioId);

        // Recuperar la entidad Mascota gestionada por JPA
        Mascota mascota = mascotaService.getEntityById(mascotaId);

        // Crear y guardar acceso temporal
        AccesoTemporal accesoTemporal = new AccesoTemporal();
        accesoTemporal.setToken(generarCodigoNumerico());
        accesoTemporal.setUsuario(usuario);
        accesoTemporal.setMascota(mascota);

        accesoTemporalRepository.save(accesoTemporal);

        return accesoTemporalMapper.toDTO(accesoTemporal);
    }

    /* @Transactional
    public String generarTokenTemporal(String tokenAccesoTemporal, Long idMascota) {
        return jwtService.generateTemporalToken(tokenAccesoTemporal, idMascota);
    } */

    @Transactional
    public String generarTokenConExpiracion(String tokenAccesoTemporal, Long idMascota, LocalDateTime expirationTime) {
        long expirationMillis = expirationTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        // Utilizamos el JwtService para generar el token
        return jwtService.generateTemporalToken(tokenAccesoTemporal, idMascota, expirationMillis);
    }

    @Transactional
    private String generarCodigoNumerico() {
        Random random = new Random();
        int code = random.nextInt(999999);
        return String.format("%06d", code);
    }

    @Transactional
    public Optional<AccesoTemporalDTO> findByToken(String token) {
        return accesoTemporalRepository.findByToken(token)
                .map(accesoTemporalMapper::toDTO);
    }

    /* @Transactional
    public Optional<AccesoTemporalDTO> findByTokenAndFechaExpiracionIsNull(String token) {
        return accesoTemporalRepository.findByTokenAndFechaExpiracionIsNull(tmascotaoken)
                .map(accesoTemporalMapper::toDTO);
    } */

    @Transactional
    public Optional<AccesoTemporalDTO> findValidToken(String token) {
        return accesoTemporalRepository.findByToken(token)
                .filter(acceso -> acceso.getFechaExpiracion() == null || acceso.getFechaExpiracion().isAfter(LocalDateTime.now()))
                .map(accesoTemporalMapper::toDTO);
    }

    @Transactional
    public void save(AccesoTemporalDTO accesoDTO, Usuario usuario, Mascota mascota) {
        AccesoTemporal acceso = accesoTemporalMapper.toEntity(accesoDTO, usuario, mascota);
        accesoTemporalRepository.save(acceso);
    }

    @Transactional
    public void update(AccesoTemporalDTO accesoDTO) {
        // Buscamos el acceso temporal existente
        AccesoTemporal acceso = accesoTemporalRepository.findByToken(accesoDTO.getToken())
                .orElseThrow(() -> new IllegalStateException("Acceso temporal no encontrado"));

        // Se actualizan los campos necesarios
        acceso.setNumColegiado(accesoDTO.getNumColegiado());
        acceso.setFechaExpiracion(accesoDTO.getFechaExpiracion());

        // Guardamos los cambios
        accesoTemporalRepository.save(acceso);
    }
}

