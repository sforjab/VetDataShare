package com.uoc.tfm.vds_backend.prueba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uoc.tfm.vds_backend.prueba.model.DocumentoPrueba;

@Repository
public interface DocumentoPruebaRepository extends JpaRepository <DocumentoPrueba, Long> {
    boolean existsByNombreArchivoAndPruebaId(String nombreArchivo, Long pruebaId);
}
