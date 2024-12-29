package com.uoc.tfm.vds_backend.prueba.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uoc.tfm.vds_backend.prueba.model.Prueba;

@Repository
public interface PruebaRepository extends JpaRepository<Prueba, Long> {
    List<Prueba> findByMascotaId(Long mascotaId);
    List<Prueba> findByConsultaId(Long consultaId);
    List<Prueba> findTop3ByMascotaIdOrderByFechaDesc(Long mascotaId);
    List<Prueba> findByMascotaIdOrderByFechaDesc(Long idMascota);
    List<Prueba> findByConsultaIdOrderByFechaDesc(Long consultaId);
}
