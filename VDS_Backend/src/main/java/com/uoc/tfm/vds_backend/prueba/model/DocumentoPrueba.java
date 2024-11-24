package com.uoc.tfm.vds_backend.prueba.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/* @Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class DocumentoPrueba {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombreArchivo; // El nombre del archivo, ej. "informe.pdf"

    @Column(nullable = false)
    private String tipoArchivo; // El tipo MIME del archivo, ej. "application/pdf"

    @Lob
    @Column(nullable = false)
    private byte[] datos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prueba_id", nullable = false)
    private Prueba prueba;
} */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class DocumentoPrueba {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombreArchivo; // El nombre del archivo, ej. "informe.pdf"

    @Column(nullable = false)
    private String tipoArchivo; // El tipo MIME del archivo, ej. "application/pdf"

    @Lob
    @Column(nullable = false)
    private byte[] datos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prueba_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "documentosPrueba", "consulta", "mascota"})
    @ToString.Exclude
    private Prueba prueba;
}