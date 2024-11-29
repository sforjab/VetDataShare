package com.uoc.tfm.vds_backend.acceso_temporal.controller;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.uoc.tfm.vds_backend.acceso_temporal.dto.AccesoTemporalDTO;
import com.uoc.tfm.vds_backend.acceso_temporal.dto.ActualizarAccesoRequestDTO;
import com.uoc.tfm.vds_backend.acceso_temporal.dto.GenerarAccesoRequestDTO;
import com.uoc.tfm.vds_backend.acceso_temporal.service.AccesoTemporalService;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import com.uoc.tfm.vds_backend.usuario.service.UsuarioService;

@RestController
@RequestMapping("/api/accesos-temporales")
public class AccesoTemporalController {

    @Autowired
    private AccesoTemporalService accesoTemporalService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private MascotaService mascotaService;

    @Autowired
    private Environment environment;

    @PostMapping("/generar")
    public ResponseEntity<Map<String, String>> generarAccesoTemporal(@RequestBody GenerarAccesoRequestDTO request) {
        // Generamos el acceso temporal
        AccesoTemporalDTO accesoDTO = accesoTemporalService.generarAccesoTemporal(request.getUsuarioId(), request.getMascotaId());

        String frontendUrl = environment.getProperty("FRONTEND_URL");

        // Creamos la URL para el QR
        /* String qrUrl = String.format("http://localhost:4200/acceso-temporal/numero-colegiado/%s", accesoDTO.getToken()); */
        String qrUrl = String.format("%s/acceso-temporal/numero-colegiado/%s", frontendUrl, accesoDTO.getToken());

        // Respuesta
        Map<String, String> response = new HashMap<>();
        response.put("tokenQR", qrUrl);
        response.put("tokenNumerico", accesoDTO.getToken());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/validar-sin-expiracion/{token}")
    public ResponseEntity<AccesoTemporalDTO> validarTokenSinExpiracion(@PathVariable String token) {
        // Buscar acceso temporal sin expiración
        return accesoTemporalService.findByTokenAndFechaExpiracionIsNull(token)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Acceso temporal no válido o ya expirado"));
    }

    @PutMapping("/actualizar")
    public ResponseEntity<Map<String, String>> actualizarAccesoTemporal(@RequestBody ActualizarAccesoRequestDTO request) {
        // Buscar el acceso temporal
        AccesoTemporalDTO accesoDTO = accesoTemporalService.findByToken(request.getToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Acceso temporal no encontrado"));

         // Recuperar entidades gestionadas antes de guardar
        Usuario usuario = usuarioService.getEntityById(accesoDTO.getUsuarioId());
        Mascota mascota = mascotaService.getEntityById(accesoDTO.getMascotaId());

        // Actualizar los datos del acceso temporal
        accesoDTO.setNumColegiado(request.getNumColegiado());
        accesoDTO.setFechaExpiracion(ZonedDateTime.now(ZoneId.of("Europe/Madrid")).plusHours(1));

        // Guardar los cambios
        accesoTemporalService.save(accesoDTO, usuario, mascota);

        // Generar el JWT temporal
        String jwtTemporal = accesoTemporalService.generarTokenTemporal(request.getToken(), accesoDTO.getMascotaId());

        // Respuesta
        Map<String, String> response = new HashMap<>();
        response.put("jwtTemporal", jwtTemporal);
        response.put("idMascota", String.valueOf(accesoDTO.getMascotaId()));

        return ResponseEntity.ok(response);
    }
}