package com.uoc.tfm.vds_backend.consulta.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uoc.tfm.vds_backend.clinica.repository.ClinicaRepository;
import com.uoc.tfm.vds_backend.consulta.dto.ConsultaDTO;
import com.uoc.tfm.vds_backend.consulta.mapper.ConsultaMapper;
import com.uoc.tfm.vds_backend.consulta.model.Consulta;
import com.uoc.tfm.vds_backend.consulta.repository.ConsultaRepository;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.repository.MascotaRepository;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import com.uoc.tfm.vds_backend.usuario.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private MascotaService mascotaService;

    @Autowired
    private ConsultaMapper consultaMapper;

    @Autowired
    private ClinicaRepository clinicaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MascotaRepository mascotaRepository;

    @Transactional
    public Optional<ConsultaDTO> getConsultaPorId(Long id) {
        return consultaRepository.findById(id).map(consultaMapper::toDTO);
    }

    public List<ConsultaDTO> getConsultasPorFecha(LocalDateTime fecha) {
        return consultaRepository.findByFechaConsulta(fecha).stream()
                .map(consultaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<ConsultaDTO> getConsultasPorIdMascota(Long idMascota) {
        if (mascotaService.getMascotaPorId(idMascota).isEmpty()) {
            return List.of(); // Si la mascota no existe, se devuelve una lista vacía
        }
        return consultaRepository.findByMascotaId(idMascota).stream()
                .map(consultaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean validarPropietario(Long idUsuario, Long idMascota) {
        // Llamada al servicio de Mascota para verificar la propiedad
        return mascotaService.esPropietarioDeMascota(idUsuario, idMascota);
    }

    @Transactional
    public Optional<ConsultaDTO> createConsulta(ConsultaDTO consultaDTO) {
        try {
            // Obtener la mascota asociada desde la base de datos
            Mascota mascota = mascotaRepository.findById(consultaDTO.getMascotaId())
                    .orElseThrow(() -> new IllegalArgumentException("Mascota no encontrada con ID: " + consultaDTO.getMascotaId()));

            // Obtener el veterinario asociado
            Usuario veterinario = usuarioRepository.findById(consultaDTO.getVeterinarioId())
                    .orElseThrow(() -> new RuntimeException("Veterinario no encontrado con ID: " + consultaDTO.getVeterinarioId()));

            // Mapear el DTO a la entidad Consulta
            Consulta consulta = consultaMapper.toEntity(consultaDTO);
            consulta.setMascota(mascota); // Asociar la mascota gestionada por Hibernate
            consulta.setClinica(clinicaRepository.findById(consultaDTO.getClinicaId())
                    .orElseThrow(() -> new RuntimeException("Clínica no encontrada con ID: " + consultaDTO.getClinicaId())));
            consulta.setVeterinario(veterinario); // Asociar el veterinario

            // Guardar la consulta
            Consulta consultaCreada = consultaRepository.save(consulta);
            return Optional.of(consultaMapper.toDTO(consultaCreada));
        } catch (Exception e) {
            e.printStackTrace(); // Log para depuración
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<ConsultaDTO> updateConsulta(Long id, ConsultaDTO consultaDTO) {
        return consultaRepository.findById(id).map(consultaExistente -> {
            // Recuperar la entidad Mascota gestionada por Hibernate
            Mascota mascota = mascotaRepository.findById(consultaDTO.getMascotaId())
                    .orElseThrow(() -> new IllegalArgumentException("Mascota no encontrada"));

            // Actualizar los campos de la consulta existente
            consultaExistente.setFechaConsulta(consultaDTO.getFechaConsulta());
            consultaExistente.setMotivo(consultaDTO.getMotivo());
            consultaExistente.setNotas(consultaDTO.getNotas());
            consultaExistente.setMedicacion(consultaDTO.getMedicacion());
            consultaExistente.setMascota(mascota); // Asignar la mascota gestionada

            // Guardar y devolver
            Consulta consultaActualizada = consultaRepository.save(consultaExistente);
            return consultaMapper.toDTO(consultaActualizada);
        });
    }

    @Transactional
    public boolean validarAccesoVeterinario(Long veterinarioId, Long consultaId) {
        Usuario veterinario = usuarioRepository.findById(veterinarioId)
                .orElseThrow(() -> new IllegalArgumentException("Veterinario no encontrado"));

        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new IllegalArgumentException("Consulta no encontrada"));

        if (veterinario.getClinica() == null || !veterinario.getClinica().getId().equals(consulta.getClinica().getId())) {
            return false; // El veterinario no pertenece a la clínica de la consulta
        }

        return true;
    }


    @Transactional
    public boolean deleteConsulta(Long id) {
        if (consultaRepository.existsById(id)) {
            consultaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
