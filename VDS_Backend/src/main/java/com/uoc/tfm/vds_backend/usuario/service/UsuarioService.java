package com.uoc.tfm.vds_backend.usuario.service;

import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public Optional<Usuario> getUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> getUsuarioPorNumIdent(String numIdent) {
        return usuarioRepository.findByNumIdent(numIdent);
    }

    public Optional<Usuario> getUsuarioPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    // AÑADIR PARA BUSCAR CLIENTES

    @Transactional
    public Optional<Usuario> createUsuario(Usuario usuario) {
        try {
            // Validación de 'numIdent' único
            if (usuarioRepository.findByNumIdent(usuario.getNumIdent()).isPresent()) {
                return Optional.empty();
            }
            // Validación de 'username' único
            if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
                return Optional.empty();
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
            String passwordCodificado = passwordEncoder.encode(usuario.getPassword());
            usuario.setPassword(passwordCodificado);

            Usuario usuarioCreado = usuarioRepository.save(usuario);
            return Optional.of(usuarioCreado);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<Usuario> updateUsuario(Long id, Usuario usuarioModificado) {
        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
            if (!usuarioOpt.isPresent()) {
                return Optional.empty(); // Si el usuario no existe, se devuelve un 'Optional' vacío
            }

            Usuario usuario = usuarioOpt.get();

            // Validación de 'numIdent' único
            Optional<Usuario> usuarioMismoNumIdent = usuarioRepository.findByNumIdent(usuarioModificado.getNumIdent());
            if (usuarioMismoNumIdent.isPresent() && !usuarioMismoNumIdent.get().getId().equals(id)) {
                return Optional.empty(); // Si otro usuario tiene el mismo 'numIdent', devolvemos un 'Optional' vacío
            }

            // Validación de 'username' único
            Optional<Usuario> usuarioMismoUsername = usuarioRepository.findByUsername(usuarioModificado.getUsername());
            if (usuarioMismoUsername.isPresent() && !usuarioMismoUsername.get().getId().equals(id)) {
                return Optional.empty(); // Si otro usuario tiene el mismo 'username', se devuelve 'Optional' vacío
            }

            // Condicionar la copia de propiedades según el rol del usuario
            if (usuario.getRol() == Rol.VETERINARIO || usuario.getRol() == Rol.ADMIN_CLINICA) {
                // Veterinarios y Admin de Clínica pueden actualizar numColegiado y clinica
                BeanUtils.copyProperties(usuarioModificado, usuario, "id", "password", "mascotas", "direccion", "email", "telefono");
            } else if (usuario.getRol() == Rol.CLIENTE) {
                // Los clientes no pueden actualizar numColegiado ni clinica
                BeanUtils.copyProperties(usuarioModificado, usuario, "id", "password", "numColegiado", "clinica", "mascotas");
            }

            // Guardamos y devolvemos el usuario actualizado
            Usuario usuarioAct = usuarioRepository.save(usuario);
            return Optional.of(usuarioAct);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public boolean deleteUsuario(Long id) {
        try {
            if(usuarioRepository.existsById(id)) {
                usuarioRepository.deleteById(id);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }
}
