package com.uoc.tfm.vds_backend.vacuna.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.uoc.tfm.vds_backend.vacuna.model.Vacuna;

public interface VacunaRepository extends JpaRepository<Vacuna, Long> {
    
}
