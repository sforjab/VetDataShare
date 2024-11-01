package com.uoc.tfm.vds_backend.usuario.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uoc.tfm.vds_backend.usuario.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository <Usuario, Long> {
    Optional<Usuario> findByNumIdent(String numIdent);
    Optional<Usuario> findByUsername(String username);

    // AÑADIR PARA BUSCAR CLIENTES
}
