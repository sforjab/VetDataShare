package com.uoc.tfm.vds_backend.vacuna.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uoc.tfm.vds_backend.vacuna.model.Vacuna;

public interface VacunaRepository extends JpaRepository<Vacuna, Long> {
    List<Vacuna> findByConsultaId(Long consultaId);
    List<Vacuna> findByMascotaId(Long mascotaId);
    List<Vacuna> findTop3ByMascotaIdOrderByFechaDesc(Long mascotaId);
}
