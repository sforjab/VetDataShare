package com.uoc.tfm.vds_backend.acceso_temporal.repository;

/* import java.time.LocalDateTime;
 */import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uoc.tfm.vds_backend.acceso_temporal.model.AccesoTemporal;

@Repository
public interface AccesoTemporalRepository extends JpaRepository<AccesoTemporal, Long> {
    Optional<AccesoTemporal> findByToken(String token);
    /* void deleteByFechaExpiracionBefore(LocalDateTime now); */
    Optional<AccesoTemporal> findByTokenAndFechaExpiracionIsNull(String token);
}
