package com.uoc.tfm.vds_backend.mascota.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uoc.tfm.vds_backend.mascota.model.Mascota;


@Repository
public interface MascotaRepository extends JpaRepository <Mascota, Long> {
    Optional<Mascota> findByNumChip(String numChip);
    List<Mascota> findByNombre(String nombre);
    boolean existsByIdAndUsuarioId(Long idUsuario, Long idMascota);
    List<Mascota> findByUsuarioId(Long usuarioId);
    List<Mascota> findByClinicaId(Long clinicaId);
    List<Mascota> findAllByUsuarioId(Long usuarioId);
}
