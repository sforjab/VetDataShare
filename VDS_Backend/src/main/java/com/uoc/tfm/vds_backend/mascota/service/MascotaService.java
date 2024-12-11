package com.uoc.tfm.vds_backend.mascota.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.clinica.repository.ClinicaRepository;
import com.uoc.tfm.vds_backend.mascota.dto.MascotaDTO;
import com.uoc.tfm.vds_backend.mascota.mapper.MascotaMapper;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.repository.MascotaRepository;
import com.uoc.tfm.vds_backend.usuario.repository.UsuarioRepository;
import com.uoc.tfm.vds_backend.usuario.service.UsuarioService;

@Service
public class MascotaService {

    @Autowired
    MascotaRepository mascotaRepository;

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    MascotaMapper mascotaMapper;

    @Autowired
    ClinicaRepository clinicaRepository;

    @Transactional
    public Optional<MascotaDTO> getMascotaPorId(Long id) {
        return mascotaRepository.findById(id)
                .map(mascotaMapper::toDTO);
    }

    @Transactional
    public Mascota getEntityById(Long id) {
        return mascotaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada con ID: " + id));
    }


    @Transactional
    public Optional<MascotaDTO> getMascotaPorNumChip(String numChip) {
        return mascotaRepository.findByNumChip(numChip)
                .map(mascotaMapper::toDTO);
    }

    @Transactional
    public List<MascotaDTO> getMascotaPorNombre(String nombre) {
        return mascotaRepository.findByNombre(nombre).stream()
                .map(mascotaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<MascotaDTO> getMascotasPorIdUsuario(Long idUsuario) {
        return mascotaRepository.findByUsuarioId(idUsuario).stream()
            .map(mascotaMapper::toDTO)
            .collect(Collectors.toList());
    }

    public boolean verificarPropietario(Long idMascota, Long idUsuario) {
        System.out.println("Verificando propietario para mascota ID: " + idMascota + ", usuario ID: " + idUsuario);
    
        Optional<Mascota> mascotaOpt = mascotaRepository.findById(idMascota);
    
        if (mascotaOpt.isPresent()) {
            Mascota mascota = mascotaOpt.get();
            Long idPropietario = mascota.getUsuario().getId();
            System.out.println("Propietario registrado en la base de datos: " + idPropietario);
    
            boolean esPropietario = idPropietario.equals(idUsuario);
            System.out.println("¿Usuario autenticado es propietario?: " + esPropietario);
    
            return esPropietario;
        }
    
        System.out.println("Mascota no encontrada en la base de datos.");
        return false;
    }
    

    @Transactional
    public boolean esPropietarioDeMascota(Long idUsuario, Long idMascota) {
        return mascotaRepository.existsByIdAndUsuarioId(idMascota, idUsuario);
    }

    @Transactional
    public List<MascotaDTO> buscarMascotas(String numChip, String nombre, String especie, String raza) {
        Mascota mascota = new Mascota();
        mascota.setNumChip(numChip);
        mascota.setNombre(nombre);
        mascota.setEspecie(especie);
        mascota.setRaza(raza);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id", "sexo", "fechaNacimiento")
                .withIgnoreNullValues()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreCase();

        Example<Mascota> example = Example.of(mascota, matcher);
        return mascotaRepository.findAll(example).stream()
                .map(mascotaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<MascotaDTO> createMascota(MascotaDTO mascotaDTO) {
        if (mascotaRepository.findByNumChip(mascotaDTO.getNumChip()).isPresent()) {
            return Optional.empty();
        }

        Mascota mascota = mascotaMapper.toEntity(mascotaDTO);
        mascota.setUsuario(usuarioService.getEntityById(mascotaDTO.getPropietarioId())); // Asignar propietario
        mascota.setClinica(clinicaRepository.findById(mascotaDTO.getClinicaId())
            .orElseThrow(() -> new RuntimeException("Clínica no encontrada con ID: " + mascotaDTO.getClinicaId())));
        mascota.setFechaAlta(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        Mascota mascotaCreada = mascotaRepository.save(mascota);
        return Optional.of(mascotaMapper.toDTO(mascotaCreada));
    }

    @Transactional
    public Optional<MascotaDTO> updateMascota(Long id, MascotaDTO mascotaDTO) {
        Optional<Mascota> mascotaExistente = mascotaRepository.findById(id);

        if (mascotaExistente.isPresent()) {
            Mascota mascota = mascotaExistente.get();

            Optional<Mascota> mascotaMismoChip = mascotaRepository.findByNumChip(mascotaDTO.getNumChip());
            if (mascotaMismoChip.isPresent() && !mascotaMismoChip.get().getId().equals(id)) {
                return Optional.empty();
            }

            mascota.setNumChip(mascotaDTO.getNumChip());
            mascota.setNombre(mascotaDTO.getNombre());
            mascota.setEspecie(mascotaDTO.getEspecie());
            mascota.setRaza(mascotaDTO.getRaza());
            mascota.setSexo(mascotaDTO.getSexo());
            mascota.setFechaNacimiento(mascotaDTO.getFechaNacimiento());

            if (mascotaDTO.getPropietarioId() != null) {
                mascota.setUsuario(usuarioService.getEntityById(mascotaDTO.getPropietarioId()));
            }

            Mascota mascotaActualizada = mascotaRepository.save(mascota);

            return Optional.of(mascotaMapper.toDTO(mascotaActualizada));
        }
        return Optional.empty();
    }

    @Transactional
    public boolean deleteMascota(Long id) {
        if (mascotaRepository.existsById(id)) {
            mascotaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
