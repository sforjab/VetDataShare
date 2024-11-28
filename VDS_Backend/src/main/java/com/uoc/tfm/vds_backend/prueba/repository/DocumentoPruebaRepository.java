package com.uoc.tfm.vds_backend.prueba.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uoc.tfm.vds_backend.prueba.model.DocumentoPrueba;

@Repository
public interface DocumentoPruebaRepository extends JpaRepository <DocumentoPrueba, Long> {
    boolean existsByNombreArchivoAndPruebaId(String nombreArchivo, Long pruebaId);
    List<DocumentoPrueba> findByPruebaId(Long pruebaId);
}
