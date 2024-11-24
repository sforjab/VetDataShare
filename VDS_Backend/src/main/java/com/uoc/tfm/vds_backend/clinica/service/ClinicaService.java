package com.uoc.tfm.vds_backend.clinica.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.clinica.dto.ClinicaDTO;
import com.uoc.tfm.vds_backend.clinica.mapper.ClinicaMapper;
import com.uoc.tfm.vds_backend.clinica.model.Clinica;
import com.uoc.tfm.vds_backend.clinica.repository.ClinicaRepository;

@Service
public class ClinicaService {

    @Autowired
    ClinicaRepository clinicaRepository;

    @Autowired
    ClinicaMapper clinicaMapper;

    public Optional<ClinicaDTO> getClinicaPorId(Long id) {
        return clinicaRepository.findById(id)
                .map(clinicaMapper::toDTO);
    }

    public Optional<ClinicaDTO> getClinicaPorNombre(String nombre) {
        return clinicaRepository.findByNombre(nombre)
                .map(clinicaMapper::toDTO);
    }

    @Transactional
    public Optional<ClinicaDTO> createClinica(ClinicaDTO clinicaDTO) {
        if (clinicaRepository.findByNombre(clinicaDTO.getNombre()).isPresent()) {
            return Optional.empty();
        }

        Clinica clinica = clinicaMapper.toEntity(clinicaDTO);
        Clinica clinicaCreada = clinicaRepository.save(clinica);
        return Optional.of(clinicaMapper.toDTO(clinicaCreada));
    }

    @Transactional
    public Optional<ClinicaDTO> updateClinica(Long id, ClinicaDTO clinicaDTO) {
        return clinicaRepository.findById(id).map(clinicaExistente -> {
            // Actualizar solo campos permitidos
            clinicaExistente.setNombre(clinicaDTO.getNombre());
            clinicaExistente.setDireccion(clinicaDTO.getDireccion());
            clinicaExistente.setTelefono(clinicaDTO.getTelefono());
            clinicaExistente.setEmail(clinicaDTO.getEmail());

            Clinica clinicaActualizada = clinicaRepository.save(clinicaExistente);
            return clinicaMapper.toDTO(clinicaActualizada);
        });
    }

    @Transactional
    public boolean deleteClinica(Long id) {
        if (clinicaRepository.existsById(id)) {
            clinicaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
