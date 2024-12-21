package com.uoc.tfm.vds_backend.vacuna.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.consulta.model.Consulta;
import com.uoc.tfm.vds_backend.consulta.repository.ConsultaRepository;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.vacuna.dto.VacunaDTO;
import com.uoc.tfm.vds_backend.vacuna.mapper.VacunaMapper;
import com.uoc.tfm.vds_backend.vacuna.model.Vacuna;
import com.uoc.tfm.vds_backend.vacuna.repository.VacunaRepository;

@Service
public class VacunaService {

    @Autowired
    private VacunaRepository vacunaRepository;

    @Autowired
    private VacunaMapper vacunaMapper;

    @Autowired
    ConsultaRepository consultaRepository;

    @Transactional
    public Optional<VacunaDTO> getVacunaPorId(Long id) {
        return vacunaRepository.findById(id).map(vacunaMapper::toDTO);
    }

    @Transactional
    public List<VacunaDTO> getVacunasPorIdMascota(Long idMascota) {
        return vacunaRepository.findByMascotaId(idMascota).stream()
                .map(vacunaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<VacunaDTO> getUltimasVacunas(Long idMascota) {
        return vacunaRepository.findTop3ByMascotaIdOrderByFechaDesc(idMascota).stream()
        .map(vacunaMapper::toDTO)
        .collect(Collectors.toList());
    }

    @Transactional
    public List<VacunaDTO> getVacunasPorConsultaId(Long consultaId) {
        return vacunaRepository.findByConsultaId(consultaId).stream()
                .map(vacunaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<VacunaDTO> createVacuna(VacunaDTO vacunaDTO) {
        try {
            // Obtenemos la consulta asociada
            Consulta consulta = consultaRepository.findById(vacunaDTO.getConsultaId())
                    .orElseThrow(() -> new RuntimeException("Consulta no encontrada con ID: " + vacunaDTO.getConsultaId()));

            // Obtenemos la mascota asociada a la consulta
            Mascota mascota = consulta.getMascota();

            // Se configuran los valores adicionales
            Vacuna vacuna = vacunaMapper.toEntity(vacunaDTO);
            vacuna.setMascota(mascota);
            vacuna.setConsulta(consulta);
            vacuna.setFecha(LocalDateTime.now());

            // Guardamos la vacuna

            Vacuna vacunaCreada = vacunaRepository.save(vacuna);
            return Optional.of(vacunaMapper.toDTO(vacunaCreada));
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<VacunaDTO> updateVacuna(Long id, VacunaDTO vacunaDTO) {
        return vacunaRepository.findById(id).map(vacunaExistente -> {
            vacunaExistente.setNombre(vacunaDTO.getNombre());
            vacunaExistente.setLaboratorio(vacunaDTO.getLaboratorio());
            Vacuna vacunaActualizada = vacunaRepository.save(vacunaExistente);
            return vacunaMapper.toDTO(vacunaActualizada);
        });
    }

    @Transactional
    public boolean delete(Long id) {
        if (vacunaRepository.existsById(id)) {
            vacunaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
