package com.uoc.tfm.vds_backend.vacuna.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public List<VacunaDTO> getVacunasPorConsultaId(Long consultaId) {
        return vacunaRepository.findByConsultaId(consultaId).stream()
                .map(vacunaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<VacunaDTO> createVacuna(VacunaDTO vacunaDTO) {
        try {
            Vacuna vacuna = vacunaMapper.toEntity(vacunaDTO);
            Vacuna vacunaCreada = vacunaRepository.save(vacuna);
            return Optional.of(vacunaMapper.toDTO(vacunaCreada));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<VacunaDTO> updateVacuna(Long id, VacunaDTO vacunaDTO) {
        return vacunaRepository.findById(id).map(vacunaExistente -> {
            vacunaExistente.setNombre(vacunaDTO.getNombre());
            vacunaExistente.setFecha(vacunaDTO.getFecha());
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
