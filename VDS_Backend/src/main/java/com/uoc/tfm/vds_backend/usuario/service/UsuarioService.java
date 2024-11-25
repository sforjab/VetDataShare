package com.uoc.tfm.vds_backend.usuario.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uoc.tfm.vds_backend.clinica.model.Clinica;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.repository.MascotaRepository;
import com.uoc.tfm.vds_backend.usuario.dto.UsuarioDTO;
import com.uoc.tfm.vds_backend.usuario.mapper.UsuarioMapper;
import com.uoc.tfm.vds_backend.usuario.model.Rol;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import com.uoc.tfm.vds_backend.usuario.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class UsuarioService {
    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    UsuarioMapper usuarioMapper;

    @Autowired
    MascotaRepository mascotaRepository;

    public Optional<UsuarioDTO> getUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).map(usuarioMapper::toDTO);
    }

    @Transactional
    public Usuario getEntityById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }


    public Optional<UsuarioDTO> getUsuarioPorNumIdent(String numIdent) {
        return usuarioRepository.findByNumIdent(numIdent).map(usuarioMapper::toDTO);
    }

    public Optional<UsuarioDTO> getUsuarioPorUsername(String username) {
        return usuarioRepository.findByUsername(username).map(usuarioMapper::toDTO);
    }

    @Transactional
    public List<UsuarioDTO> buscarClientes(String numIdent, String nombre, String apellido1, String apellido2, String telefono, String email) {
        Usuario cliente = new Usuario();
        cliente.setRol(Rol.CLIENTE);
        cliente.setNumIdent(numIdent);
        cliente.setNombre(nombre);
        cliente.setApellido1(apellido1);
        cliente.setApellido2(apellido2);
        cliente.setTelefono(telefono);
        cliente.setEmail(email);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id", "direccion", "username", "password")
                .withIgnoreNullValues()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreCase();

        Example<Usuario> example = Example.of(cliente, matcher);
        return usuarioRepository.findAll(example)
                .stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<UsuarioDTO> buscarEmpleados(Long idClinica, String nombre, String apellido1, String apellido2, String rol) {
        Usuario empleado = new Usuario();
        if (idClinica != null) {
            Clinica clinica = new Clinica();
            clinica.setId(idClinica);
            empleado.setClinica(clinica);
        }
        empleado.setNombre(nombre);
        empleado.setApellido1(apellido1);
        empleado.setApellido2(apellido2);

        if (rol != null && !rol.isEmpty()) {
            empleado.setRol(Rol.valueOf(rol));
        }

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("id", "username", "password", "numIdent", "numColegiado", "direccion", "email")
                .withIgnoreNullValues()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreCase();

        Example<Usuario> example = Example.of(empleado, matcher);
        return usuarioRepository.findAll(example)
                .stream()
                .filter(usuario -> rol != null || usuario.getRol() == Rol.VETERINARIO || usuario.getRol() == Rol.ADMIN_CLINICA)
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<Usuario> getUsuarioEntityPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    /* @Transactional
    public boolean transferirMascotas(String numIdentOrigen, String numIdentDestino) {
        // Obtenemos los usuarios de origen y destino por 'numIdent'
        Usuario usuarioOrigen = usuarioRepository.findByNumIdent(numIdentOrigen)
            .orElseThrow(() -> new RuntimeException("Usuario origen no encontrado: " + numIdentOrigen));
        Usuario usuarioDestino = usuarioRepository.findByNumIdent(numIdentDestino)
            .orElseThrow(() -> new RuntimeException("Usuario destino no encontrado: " + numIdentDestino));

        // Obtenemos todas las mascotas del usuario origen
        List<Mascota> mascotas = mascotaRepository.findByUsuarioId(usuarioOrigen.getId());

        if (mascotas.isEmpty()) {
            throw new RuntimeException("No se encontraron mascotas asociadas al usuario origen.");
        }

         // Se transfiere cada mascota al usuario destino
        for (Mascota mascota : mascotas) {
            mascota.setUsuario(usuarioDestino); // Asociar la mascota al usuario destino
        }

        // Guardamos los cambios en las mascotas
        mascotaRepository.saveAll(mascotas);

        if (!mascotaRepository.findByUsuarioId(usuarioOrigen.getId()).isEmpty()) {
            throw new RuntimeException("Error al vaciar las mascotas del usuario origen.");
        }

        return true;
    } */

    @Transactional
    public void transferirMascotas(String numIdentOrigen, String numIdentDestino, Optional<Long> idMascota) {
        Usuario usuarioOrigen = usuarioRepository.findByNumIdent(numIdentOrigen)
            .orElseThrow(() -> new RuntimeException("Usuario origen no encontrado: " + numIdentOrigen));
        Usuario usuarioDestino = usuarioRepository.findByNumIdent(numIdentDestino)
            .orElseThrow(() -> new RuntimeException("Usuario destino no encontrado: " + numIdentDestino));

        List<Mascota> mascotas;

        if (idMascota.isPresent()) {
            // Transferencia individual
            Mascota mascota = mascotaRepository.findById(idMascota.get())
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada con ID: " + idMascota.get()));
            if (!mascota.getUsuario().equals(usuarioOrigen)) {
                throw new RuntimeException("La mascota no pertenece al usuario origen.");
            }
            mascota.setUsuario(usuarioDestino);
            mascotas = List.of(mascota);
        } else {
            // Transferencia masiva
            mascotas = mascotaRepository.findByUsuarioId(usuarioOrigen.getId());
            if (mascotas.isEmpty()) {
                throw new RuntimeException("No se encontraron mascotas asociadas al usuario origen.");
            }
            // Se transfiere cada mascota al usuario destino
            for (Mascota mascota : mascotas) {
                mascota.setUsuario(usuarioDestino);
            }
        }
        // Guardamos los cambios en las mascotas
        mascotaRepository.saveAll(mascotas);
    }


    @Transactional
    public Optional<UsuarioDTO> createUsuario(UsuarioDTO usuarioDTO) {
        try {
            String cleanedNumIdent = usuarioDTO.getNumIdent().trim();

            // Validación de 'numIdent' único
            if (usuarioRepository.findByNumIdent(cleanedNumIdent).isPresent()) {
                return Optional.empty();
            }

            // Validación de 'username' único
            if (usuarioDTO.getUsername() == null || usuarioDTO.getUsername().isEmpty()) {
                usuarioDTO.setUsername(cleanedNumIdent); // Asignar numIdent como username por defecto
            }
            if (usuarioRepository.findByUsername(usuarioDTO.getUsername()).isPresent()) {
                return Optional.empty(); // Username duplicado
            }

            // Se genera un password por defecto si no está presente
            if (usuarioDTO.getPassword() == null || usuarioDTO.getPassword().isEmpty()) {
                usuarioDTO.setPassword("password"); // Asignar un password por defecto
            }

            Usuario usuario = usuarioMapper.toEntity(usuarioDTO);

            // Se inicializan colecciones vacías si son nulas
            if (usuario.getMascotas() == null) {
                usuario.setMascotas(new ArrayList<>());
            }

            // Solo permite asociar una clínica y un número de colegiado si el rol es VETERINARIO o ADMIN_CLINICA
            if ((usuario.getRol() == Rol.VETERINARIO || usuario.getRol() == Rol.ADMIN_CLINICA)) {
                // Validación de clínica
                if (usuario.getClinica() == null) {
                    return Optional.empty(); // No se puede crear sin clínica
                }

                // Validación de numColegiado
                if (usuario.getNumColegiado() == null || usuario.getNumColegiado().isEmpty()) {
                    return Optional.empty(); // No se puede crear sin numColegiado
                }
            }

            // Se encripta la contraseña antes de guardar
            String passwordCodificado = passwordEncoder.encode(usuarioDTO.getPassword());
            usuario.setPassword(passwordCodificado);

            Usuario usuarioCreado = usuarioRepository.save(usuario);
            return Optional.of(usuarioMapper.toDTO(usuarioCreado));
        } catch (Exception e) {
            return Optional.empty();
        }
    }


    @Transactional
    public Optional<UsuarioDTO> updateUsuario(Long id, UsuarioDTO usuarioDTO) {
        try {
            System.out.println("Buscando usuario con ID: " + id);
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
            
            if (usuarioOpt.isEmpty()) {
                System.out.println("Usuario no encontrado con ID: " + id);
                return Optional.empty(); // Si el usuario no existe, se devuelve un 'Optional' vacío
            }

            Usuario usuario = usuarioOpt.get();

            // Validación de 'numIdent' único
            System.out.println("Validando 'numIdent'...");
            Optional<Usuario> usuarioMismoNumIdent = usuarioRepository.findByNumIdent(usuarioDTO.getNumIdent());
            if (usuarioMismoNumIdent.isPresent() && !usuarioMismoNumIdent.get().getId().equals(id)) {
                System.out.println("Número de identificación duplicado: " + usuarioDTO.getNumIdent());
                return Optional.empty(); // Si otro usuario tiene el mismo 'numIdent', devolvemos un 'Optional' vacío
            }

            // Validación de 'username' único
            System.out.println("Validando 'username'...");
            Optional<Usuario> usuarioMismoUsername = usuarioRepository.findByUsername(usuarioDTO.getUsername());
            if (usuarioMismoUsername.isPresent() && !usuarioMismoUsername.get().getId().equals(id)) {
                System.out.println("Nombre de usuario duplicado: " + usuarioDTO.getUsername());
                return Optional.empty(); // Si otro usuario tiene el mismo 'username', se devuelve 'Optional' vacío
            }

            // Copiar propiedades manualmente según rol
            usuario.setNumIdent(usuarioDTO.getNumIdent());
            usuario.setNombre(usuarioDTO.getNombre());
            usuario.setApellido1(usuarioDTO.getApellido1());
            usuario.setApellido2(usuarioDTO.getApellido2());
            usuario.setDireccion(usuarioDTO.getDireccion());
            usuario.setTelefono(usuarioDTO.getTelefono());
            usuario.setEmail(usuarioDTO.getEmail());
            usuario.setRol(Rol.valueOf(usuarioDTO.getRol()));
            usuario.setUsername(usuarioDTO.getUsername());

            // Condicionar según el rol del usuario
            if (usuario.getRol() == Rol.VETERINARIO || usuario.getRol() == Rol.ADMIN_CLINICA) {
                if (usuarioDTO.getClinicaId() != null) {
                    Clinica clinica = new Clinica();
                    clinica.setId(usuarioDTO.getClinicaId());
                    usuario.setClinica(clinica); // Asociar clínica si corresponde
                } else {
                    usuario.setClinica(null); // Limpiar clínica si no está en el DTO
                }
                usuario.setNumColegiado(usuarioDTO.getNumColegiado());
            } else if (usuario.getRol() == Rol.CLIENTE) {
                // Los clientes no pueden tener clínica ni numColegiado
                usuario.setClinica(null);
                usuario.setNumColegiado(null);
            }

            System.out.println("Guardando usuario actualizado...");
            Usuario usuarioActualizado = usuarioRepository.save(usuario);
            System.out.println("Usuario actualizado correctamente: " + usuarioActualizado);
            return Optional.of(usuarioMapper.toDTO(usuarioActualizado));
        } catch (Exception e) {
            System.out.println("Error al actualizar usuario: " + e.getMessage());
            return Optional.empty();
        }
    }


    @Transactional
    public boolean deleteUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
