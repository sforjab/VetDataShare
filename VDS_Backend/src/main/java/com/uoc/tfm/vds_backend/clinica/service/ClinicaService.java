package com.uoc.tfm.vds_backend.clinica.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.clinica.dto.ClinicaDTO;
import com.uoc.tfm.vds_backend.clinica.mapper.ClinicaMapper;
import com.uoc.tfm.vds_backend.clinica.model.Clinica;
import com.uoc.tfm.vds_backend.clinica.repository.ClinicaRepository;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import com.uoc.tfm.vds_backend.usuario.repository.UsuarioRepository;

@Service
public class ClinicaService {

    @Autowired
    ClinicaRepository clinicaRepository;

    @Autowired
    ClinicaMapper clinicaMapper;

    @Autowired
    UsuarioRepository usuarioRepository;

    public Optional<ClinicaDTO> getClinicaPorId(Long id) {
        return clinicaRepository.findById(id)
                .map(clinicaMapper::toDTO);
    }

    public Optional<ClinicaDTO> getClinicaPorNombre(String nombre) {
        return clinicaRepository.findByNombre(nombre)
                .map(clinicaMapper::toDTO);
    }

    @Transactional
    public List<ClinicaDTO> buscarClinicas(String nombre, String direccion, String telefono, String email, boolean activo) {
        Clinica clinica = new Clinica();
        clinica.setNombre(nombre);
        clinica.setDireccion(direccion);
        clinica.setTelefono(telefono);
        clinica.setEmail(email);
        clinica.setActivo(true);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id")
                .withIgnoreNullValues()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreCase();

        Example<Clinica> example = Example.of(clinica, matcher);
        return clinicaRepository.findAll(example).stream()
                .map(clinicaMapper::toDTO)
                .collect(Collectors.toList());
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
            // Se actualizan solo campos permitidos
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

    @Transactional
    public void darBajaClinica(Long idClinica) {
        Clinica clinica = clinicaRepository.findById(idClinica)
            .orElseThrow(() -> new RuntimeException("Clínica no encontrada"));

        if (!clinica.isActivo()) {
            throw new RuntimeException("La clínica ya está dada de baja");
        }

        // Baja lógica de la clínica
        clinica.setActivo(false);
        clinicaRepository.save(clinica);

        // Desvinculamos empleados asociados
        List<Usuario> empleados = usuarioRepository.findByClinicaId(clinica.getId());
        for (Usuario empleado : empleados) {
            empleado.setClinica(null); // Desvinculamos de la clínica
            usuarioRepository.save(empleado);
        }
    }
}
