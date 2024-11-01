package com.uoc.tfm.vds_backend.prueba.repository;

import org.springframework.stereotype.Repository;

import com.uoc.tfm.vds_backend.prueba.model.Prueba;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface PruebaRepository extends JpaRepository<Prueba, Long> {

}
