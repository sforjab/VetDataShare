package com.uoc.tfm.vds_backend.consulta.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uoc.tfm.vds_backend.consulta.model.Consulta;


@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    List<Consulta> findByFechaConsulta(LocalDateTime fecha);
    List<Consulta> findByMascotaId(Long mascotaId);
    List<Consulta> findByClinicaId(Long clinicaId);
    List<Consulta> findTop3ByMascotaIdOrderByFechaConsultaDesc(Long mascotaId);
    boolean existsByIdAndMascotaIdIn(Long idConsulta, List<Long> mascotaIds);
    List<Consulta> findByMascotaIdOrderByFechaConsultaDesc(Long idMascota);
}
