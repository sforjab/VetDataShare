package com.uoc.tfm.vds_backend.consulta.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uoc.tfm.vds_backend.consulta.dto.ConsultaDTO;
import com.uoc.tfm.vds_backend.consulta.mapper.ConsultaMapper;
import com.uoc.tfm.vds_backend.consulta.model.Consulta;
import com.uoc.tfm.vds_backend.consulta.repository.ConsultaRepository;
import com.uoc.tfm.vds_backend.mascota.dto.MascotaDTO;
import com.uoc.tfm.vds_backend.mascota.mapper.MascotaMapper;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;

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
    private MascotaMapper mascotaMapper;

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
            MascotaDTO mascotaDTO = mascotaService.getMascotaPorId(consultaDTO.getMascotaId())
                    .orElseThrow(() -> new IllegalArgumentException("Mascota no encontrada"));
            Mascota mascota = mascotaMapper.toEntity(mascotaDTO);
            Consulta consulta = consultaMapper.toEntity(consultaDTO);
            consulta.setMascota(mascota);
            Consulta consultaCreada = consultaRepository.save(consulta);
            return Optional.of(consultaMapper.toDTO(consultaCreada));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<ConsultaDTO> updateConsulta(Long id, ConsultaDTO consultaDTO) {
        return consultaRepository.findById(id).map(consultaExistente -> {
            MascotaDTO mascotaDTO = mascotaService.getMascotaPorId(consultaDTO.getMascotaId())
                    .orElseThrow(() -> new IllegalArgumentException("Mascota no encontrada"));

            Mascota mascota = mascotaMapper.toEntity(mascotaDTO);

            consultaExistente.setFechaConsulta(consultaDTO.getFechaConsulta());
            consultaExistente.setMotivo(consultaDTO.getMotivo());
            consultaExistente.setNotas(consultaDTO.getNotas());
            consultaExistente.setMedicacion(consultaDTO.getMedicacion());
            consultaExistente.setMascota(mascota);

            Consulta consultaActualizada = consultaRepository.save(consultaExistente);
            return consultaMapper.toDTO(consultaActualizada);
        });
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
