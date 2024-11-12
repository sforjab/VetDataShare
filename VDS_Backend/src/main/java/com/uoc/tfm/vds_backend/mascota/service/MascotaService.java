package com.uoc.tfm.vds_backend.mascota.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.repository.MascotaRepository;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import com.uoc.tfm.vds_backend.usuario.service.UsuarioService;

@Service
public class MascotaService {

    @Autowired
    MascotaRepository mascotaRepository;

    @Autowired
    UsuarioService usuarioService;

    public Optional<Mascota> getMascotaPorId(Long id) {
        return mascotaRepository.findById(id);
    }
    
    public Optional<Mascota> getMascotaPorNumChip(String numChip) {
        return mascotaRepository.findByNumChip(numChip);
    }

    public List<Mascota> getMascotaPorNombre(String nombre) {
        return mascotaRepository.findByNombre(nombre);
    }

    public List<Mascota> getMascotasPorIdUsuario(Long idUsuario) {
        Optional<Usuario> usuario = usuarioService.getUsuarioPorId(idUsuario);
        
        // Si el usuario no existe, se devuelve lista vacía
        if (!usuario.isPresent()) {
            return List.of();
        }
        
        return usuario.get().getMascotas();
    }

    public boolean esPropietarioDeMascota(Long idUsuario, Long idMascota) {
        return mascotaRepository.existsByIdAndUsuarioId(idMascota, idUsuario);
    }

    @Transactional
public List<Mascota> buscarMascotas(String numChip, String nombre, String especie, String raza) {
    Mascota probe = new Mascota();
    probe.setNombre(numChip);
    probe.setNombre(nombre);
    probe.setEspecie(especie);
    probe.setRaza(raza);

    ExampleMatcher matcher = ExampleMatcher.matching()
            .withIgnorePaths("id", "sexo", "fechaNacimiento")
            .withIgnoreNullValues()
            .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
            .withIgnoreCase();

    Example<Mascota> example = Example.of(probe, matcher);
    return mascotaRepository.findAll(example);
}

    
    @Transactional
    public Optional<Mascota> createMascota(Mascota mascota) {       
        try {
            // Si existe otra mascota con el mismo número de chip, se devuelve 'Optional' vacío
            if (mascotaRepository.findByNumChip(mascota.getNumChip()).isPresent()) {
                return Optional.empty();
            }

            Mascota mascotaCreada = mascotaRepository.save(mascota);
            return Optional.of(mascotaCreada);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<Mascota> updateMascota(Long id, Mascota mascotaModificada) {
        try {
            Optional<Mascota> mascota = mascotaRepository.findById(id);

            // Si la mascota no existe, devolvemos 'Optional' vacío
            if (!mascota.isPresent()) {
                return Optional.empty();
            }

            Optional<Mascota> mascotaMismoChip = mascotaRepository.findByNumChip(mascotaModificada.getNumChip());
            // Si existe otra mascota con el mismo 'numChip', se devuelve 'Optional' vacío
            if (mascotaMismoChip.isPresent() && !mascotaMismoChip.get().getId().equals(id)) {
                return Optional.empty();
            }

            // Copiamos las propiedades de 'mascotaModificada' a 'mascota' existente, excluyendo el 'id'
            BeanUtils.copyProperties(mascotaModificada, mascota.get(), "id");
            
            // Guardamos y devolvemos la mascota actualizada
            Mascota mascotaAct = mascotaRepository.save(mascota.get());
            return Optional.of(mascotaAct);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public boolean deleteMascota(Long id) {
        try {
            if(mascotaRepository.existsById(id)) {
                mascotaRepository.deleteById(id);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }
}
