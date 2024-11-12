package com.uoc.tfm.vds_backend.acceso_temporal.controller;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.uoc.tfm.vds_backend.acceso_temporal.model.AccesoTemporal;
import com.uoc.tfm.vds_backend.acceso_temporal.model.GenerarAccesoRequest;
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

    @PostMapping("/generar")
    public ResponseEntity<AccesoTemporal> generarAccesoTemporal(@RequestBody GenerarAccesoRequest request) {
        Usuario usuario = usuarioService.getUsuarioPorId(request.getUsuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Mascota mascota = mascotaService.getMascotaPorId(request.getMascotaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mascota no encontrada"));

        AccesoTemporal acceso = accesoTemporalService.generarAccesoTemporal(usuario, mascota, request.getTipo(), 
                LocalDateTime.now().plusMinutes(15));

        return ResponseEntity.ok(acceso);
    }
}


