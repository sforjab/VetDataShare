package com.uoc.tfm.vds_backend.acceso_temporal.controller;

import java.time.LocalDateTime;
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
import com.uoc.tfm.vds_backend.jwt.JwtService;

@RestController
@RequestMapping("/api/accesos-temporales")
public class AccesoTemporalController {

    @Autowired
    private AccesoTemporalService accesoTemporalService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private Environment environment;

    @PostMapping("/generar")
    public ResponseEntity<Map<String, String>> generarAccesoTemporal(@RequestBody GenerarAccesoRequestDTO request) {
        // Generamos el acceso temporal
        AccesoTemporalDTO accesoDTO = accesoTemporalService.generarAccesoTemporal(request.getUsuarioId(), request.getMascotaId());

        String frontendUrl = environment.getProperty("FRONTEND_URL");

        // Creamos la URL para el QR
        String qrUrl = String.format("%s/acceso-temporal/numero-colegiado/%s", frontendUrl, accesoDTO.getToken());

        // Respuesta
        Map<String, String> response = new HashMap<>();
        response.put("tokenQR", qrUrl);
        response.put("tokenNumerico", accesoDTO.getToken());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/validar-sin-expiracion/{token}")
    public ResponseEntity<AccesoTemporalDTO> validarTokenSinExpiracion(@PathVariable String token) {
        // Buscamos acceso temporal que no tenga fecha de expiración o que no haya caducado
        return accesoTemporalService.findValidToken(token)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Acceso temporal no válido o ya expirado"));
    }

    @PostMapping("/verificar-temporal")
    public ResponseEntity<String> verificarTokenTemporal(@RequestBody String token) {
        boolean isExpired = jwtService.isTokenExpired(token);

        if (isExpired) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("El token ha expirado.");
        } else {
            return ResponseEntity.ok("El token es válido.");
        }
    }

    @PutMapping("/actualizar")
    public ResponseEntity<Map<String, String>> actualizarAccesoTemporal(@RequestBody ActualizarAccesoRequestDTO request) {
        // Buscamos el acceso temporal existente
        AccesoTemporalDTO accesoDTO = accesoTemporalService.findByToken(request.getToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Acceso temporal no encontrado"));

        // Calculamos la fecha de expiración una sola vez
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(30); // Media hora

        // Actualizamos los datos del acceso temporal
        accesoDTO.setNumColegiado(request.getNumColegiado());
        accesoDTO.setFechaExpiracion(expirationTime);

        // Se guardan los cambios en el registro existente
        accesoTemporalService.update(accesoDTO);

        // Generamos el JWT temporal utilizando el tiempo de expiración
        String jwtTemporal = accesoTemporalService.generarTokenConExpiracion(request.getToken(), accesoDTO.getMascotaId(), expirationTime);

        // Respuesta
        Map<String, String> response = new HashMap<>();
        response.put("jwtTemporal", jwtTemporal);
        response.put("idMascota", String.valueOf(accesoDTO.getMascotaId()));

        return ResponseEntity.ok(response);
    }
}