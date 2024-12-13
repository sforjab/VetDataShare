package com.uoc.tfm.vds_backend.usuario.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uoc.tfm.vds_backend.clinica.model.Clinica;
import com.uoc.tfm.vds_backend.clinica.repository.ClinicaRepository;
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

    @Autowired
    ClinicaRepository clinicaRepository;

    @Autowired
    private Environment environment;

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, String> tokenStorage = new HashMap<>();

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
                .filter(usuario -> usuario.getClinica() != null && usuario.getClinica().getId().equals(idClinica))
                .filter(usuario -> rol != null || usuario.getRol() == Rol.VETERINARIO || usuario.getRol() == Rol.ADMIN_CLINICA)
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<Usuario> getUsuarioEntityPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

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
                if (usuarioDTO.getClinicaId() != null) {
                    Clinica clinica = clinicaRepository.findById(usuarioDTO.getClinicaId())
                        .orElseThrow(() -> new RuntimeException("Clínica no encontrada con ID: " + usuarioDTO.getClinicaId()));
                    usuario.setClinica(clinica);
                } else {
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

            usuario.setFechaAlta(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
            Usuario usuarioCreado = usuarioRepository.save(usuario);
            return Optional.of(usuarioMapper.toDTO(usuarioCreado));
        } catch (Exception e) {
            return Optional.empty();
        }
    }


    @Transactional
    public Optional<UsuarioDTO> updateUsuario(Long id, UsuarioDTO usuarioDTO) {
        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
            
            if (usuarioOpt.isEmpty()) {
                return Optional.empty(); // Si el usuario no existe, se devuelve un 'Optional' vacío
            }

            Usuario usuario = usuarioOpt.get();

            // Validación de 'numIdent' único
            Optional<Usuario> usuarioMismoNumIdent = usuarioRepository.findByNumIdent(usuarioDTO.getNumIdent());
            if (usuarioMismoNumIdent.isPresent() && !usuarioMismoNumIdent.get().getId().equals(id)) {
                return Optional.empty(); // Si otro usuario tiene el mismo 'numIdent', devolvemos un 'Optional' vacío
            }

            // Validación de 'username' único
            Optional<Usuario> usuarioMismoUsername = usuarioRepository.findByUsername(usuarioDTO.getUsername());
            if (usuarioMismoUsername.isPresent() && !usuarioMismoUsername.get().getId().equals(id)) {
                return Optional.empty(); // Si otro usuario tiene el mismo 'username', se devuelve 'Optional' vacío
            }

            // Copiamos las propiedades manualmente según rol
            usuario.setNumIdent(usuarioDTO.getNumIdent());
            usuario.setNombre(usuarioDTO.getNombre());
            usuario.setApellido1(usuarioDTO.getApellido1());
            usuario.setApellido2(usuarioDTO.getApellido2());
            usuario.setDireccion(usuarioDTO.getDireccion());
            usuario.setTelefono(usuarioDTO.getTelefono());
            usuario.setEmail(usuarioDTO.getEmail());
            usuario.setRol(Rol.valueOf(usuarioDTO.getRol()));
            usuario.setUsername(usuarioDTO.getUsername());

            // Según el rol del usuario...
            if (usuario.getRol() == Rol.VETERINARIO || usuario.getRol() == Rol.ADMIN_CLINICA) {
                if (usuarioDTO.getClinicaId() != null) {
                    Clinica clinica = new Clinica();
                    clinica.setId(usuarioDTO.getClinicaId());
                    usuario.setClinica(clinica); // Se asocia clínica si corresponde
                } else {
                    usuario.setClinica(null); // Limpiamos clínica si no está en el DTO
                }
                usuario.setNumColegiado(usuarioDTO.getNumColegiado());
            } else if (usuario.getRol() == Rol.CLIENTE) {
                // Los clientes no pueden tener clínica ni 'numColegiado'
                usuario.setClinica(null);
                usuario.setNumColegiado(null);
            }

            // Actualizamos la contraseña solo si está presente en el DTO
            if (usuarioDTO.getPassword() != null && !usuarioDTO.getPassword().isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(usuarioDTO.getPassword()));
            }

            Usuario usuarioActualizado = usuarioRepository.save(usuario);
            return Optional.of(usuarioMapper.toDTO(usuarioActualizado));
        } catch (Exception e) {
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

    @Transactional
    public Optional<UsuarioDTO> desvincularEmpleado(Long idEmpleado) {
        try {
            Usuario empleado = usuarioRepository.findById(idEmpleado)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

            if (empleado.getClinica() == null) {
                throw new RuntimeException("El empleado ya no está asociado a una clínica");
            }

            empleado.setClinica(null); // Desvinculamos clínica
            Usuario empleadoActualizado  = usuarioRepository.save(empleado);
            return Optional.of(usuarioMapper.toDTO(empleadoActualizado ));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void enviarEmailRestablecimiento(String email) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("El email no está registrado.");
        }
    
        Usuario usuario = usuarioOpt.get();
        String token = UUID.randomUUID().toString(); // Se genera un token único
        tokenStorage.put(token, usuario.getUsername()); // Se guarda token en almacenamiento en memoria

        // Obtenemos la URL del frontend desde las propiedades de entorno
        String frontendUrl = environment.getProperty("FRONTEND_URL");
    
        // Creamos el enlace para restablecimiento de contraseña
        String restablecerLink = String.format("%s/auth/restablecer-password?token=%s", frontendUrl, token);
    
        // Enviar correo
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(usuario.getEmail());
        message.setSubject("Restablecimiento de contraseña - VetDataShare");
        message.setText("Hola, " + usuario.getNombre() + ".\n\n"
                + "Para restablecer tu contraseña, haz clic en el siguiente enlace:\n"
                + restablecerLink + "\n\n"
                + "Si no solicitaste este cambio, ignora este mensaje.");
        mailSender.send(message);
    }

    public void restablecerPassword(String token, String nuevaPassword) {
        String username = tokenStorage.get(token);
        if (username == null) {
            throw new RuntimeException("Token inválido o expirado.");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado para el token proporcionado.");
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);

        // Eliminar token una vez utilizado
        tokenStorage.remove(token);
    }

}
