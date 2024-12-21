package com.uoc.tfm.vds_backend.consulta.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.uoc.tfm.vds_backend.clinica.dto.ClinicaDTO;
import com.uoc.tfm.vds_backend.clinica.service.ClinicaService;
import com.uoc.tfm.vds_backend.consulta.dto.ConsultaDTO;
import com.uoc.tfm.vds_backend.consulta.model.ConsultaDetalleResponse;
import com.uoc.tfm.vds_backend.consulta.service.ConsultaService;
import com.uoc.tfm.vds_backend.error.ApiError;
import com.uoc.tfm.vds_backend.jwt.CustomUserDetails;
import com.uoc.tfm.vds_backend.mascota.dto.MascotaDTO;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;
import com.uoc.tfm.vds_backend.prueba.dto.PruebaDTO;
import com.uoc.tfm.vds_backend.prueba.service.PruebaService;
import com.uoc.tfm.vds_backend.usuario.dto.UsuarioDTO;
import com.uoc.tfm.vds_backend.usuario.service.UsuarioService;
import com.uoc.tfm.vds_backend.vacuna.dto.VacunaDTO;
import com.uoc.tfm.vds_backend.vacuna.service.VacunaService;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @Autowired
    private PruebaService pruebaService;

    @Autowired
    private VacunaService vacunaService;

    @Autowired
    private MascotaService mascotaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ClinicaService clinicaService;

    // Obtener el detalle completo de una consulta
    @GetMapping("/getConsultaDetalle/{id}")
    public ResponseEntity<Object> getConsultaDetalle(@PathVariable Long id) {
        Optional<ConsultaDTO> consulta = consultaService.getConsultaPorId(id);

        if (consulta.isPresent()) {
            MascotaDTO mascota = mascotaService.getMascotaPorId(consulta.get().getMascotaId()).orElse(null);
            UsuarioDTO veterinario = usuarioService.getUsuarioPorId(consulta.get().getVeterinarioId()).orElse(null);
            ClinicaDTO clinica = consulta.get().getClinicaId() != null
                    ? clinicaService.getClinicaPorId(consulta.get().getClinicaId()).orElse(null)
                    : null;
            List<PruebaDTO> pruebas = pruebaService.getPruebasPorConsultaId(id);
            List<VacunaDTO> vacunas = vacunaService.getVacunasPorConsultaId(id);

            ConsultaDetalleResponse response = new ConsultaDetalleResponse(
                    consulta.get(),
                    pruebas,
                    vacunas,
                    mascota,
                    veterinario,
                    clinica
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Consulta no encontrada con ID: " + id));
        }
    }

    // Obtener consulta por ID
    @GetMapping("/getConsultaPorId/{id}")
    public ResponseEntity<Object> getConsultaPorId(@PathVariable Long id) {
        Optional<ConsultaDTO> consultaDTO = consultaService.getConsultaPorId(id);
        if (consultaDTO.isPresent()) {
            return ResponseEntity.ok(consultaDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("Consulta no encontrada con ID: " + id));
        }
    }

    @GetMapping("/getUltimasConsultas/{idMascota}")
    public ResponseEntity<Object> getUltimasConsultasPorIdMascota(@PathVariable Long idMascota) {
        List<ConsultaDTO> ultimasConsultas = consultaService.getUltimasConsultas(idMascota);
        if (ultimasConsultas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("No se encontraron consultas recientes para la mascota con ID: " + idMascota));
        }
        return ResponseEntity.ok(ultimasConsultas);
    }


    // Obtener consultas por fecha
    @GetMapping("/getConsultasPorFecha/{fecha}")
    public ResponseEntity<Object> getConsultasPorFecha(@PathVariable String fecha) {
        try {
            LocalDateTime fechaConsulta = LocalDateTime.parse(fecha);
            List<ConsultaDTO> consultas = consultaService.getConsultasPorFecha(fechaConsulta);

            if (consultas.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiError("No se encontraron consultas para la fecha: " + fecha));
            }
            return ResponseEntity.ok(consultas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiError("Formato de fecha inválido: " + fecha));
        }
    }

    // Obtener consultas por ID de mascota
    @GetMapping("/getConsultasPorIdMascota/{idMascota}")
    public ResponseEntity<Object> getConsultasPorIdMascota(@PathVariable Long idMascota) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // Validación de permisos para el rol TEMPORAL
            if ("TEMPORAL".equals(userDetails.getRol()) &&
                (userDetails.getIdMascota() == null || !userDetails.getIdMascota().equals(idMascota))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiError("No tiene acceso a esta mascota."));
            }

            // Validación para CLIENTE: Verificar propiedad de la mascota
            if ("CLIENTE".equals(userDetails.getRol()) && userDetails.getIdUsuario() != null) {
                boolean esPropietario = consultaService.validarPropietario(userDetails.getIdUsuario(), idMascota);
                if (!esPropietario) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiError("No tiene acceso a esta mascota."));
                }
            }
        }

        List<ConsultaDTO> consultas = consultaService.getConsultasPorIdMascota(idMascota);
        if (consultas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("No se encontraron consultas para la mascota con ID: " + idMascota));
        }
        return ResponseEntity.ok(consultas);
    }

    @GetMapping("/getPruebasPorConsultaId/{consultaId}")
    public ResponseEntity<List<PruebaDTO>> getPruebasPorConsultaId(@PathVariable Long consultaId) {
        List<PruebaDTO> pruebas = pruebaService.getPruebasPorConsultaId(consultaId);
        if (pruebas.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content si no hay datos
        }
        return ResponseEntity.ok(pruebas); // 200 OK si hay datos
    }

    @GetMapping("/getVacunasPorConsultaId/{consultaId}")
    public ResponseEntity<List<VacunaDTO>> getVacunasPorConsultaId(@PathVariable Long consultaId) {
        List<VacunaDTO> vacunas = vacunaService.getVacunasPorConsultaId(consultaId);
        if (vacunas.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content si no hay datos
        }
        return ResponseEntity.ok(vacunas); // 200 OK si hay datos
    }

    // Crear consulta
    @PostMapping("/create")
    public ResponseEntity<Object> createConsulta(@RequestBody ConsultaDTO consultaDTO) {
        Optional<ConsultaDTO> consultaCreada = consultaService.createConsulta(consultaDTO);
        if (consultaCreada.isPresent()) {
            return ResponseEntity.ok(consultaCreada.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("Error al crear la consulta."));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateConsulta(@PathVariable Long id, @RequestBody ConsultaDTO consultaDTO) {
        System.out.println("Controller - ID recibido: " + id);
        System.out.println("Controller - DTO recibido: " + consultaDTO);
        // Actualizar la consulta
        Optional<ConsultaDTO> consultaActualizada = consultaService.updateConsulta(id, consultaDTO);

        if (consultaActualizada.isPresent()) {
            return ResponseEntity.ok(consultaActualizada.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("No se pudo actualizar. Consulta no encontrada."));
        }
    }

    // Eliminar consulta
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteConsulta(@PathVariable Long id) {
        boolean consultaEliminada = consultaService.deleteConsulta(id);
        if (consultaEliminada) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiError("Consulta no encontrada con ID: " + id));
    }
}
