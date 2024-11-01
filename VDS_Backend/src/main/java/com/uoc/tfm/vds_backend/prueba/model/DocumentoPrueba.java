package com.uoc.tfm.vds_backend.prueba.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @ManyToOne
    @JoinColumn(name = "prueba_id", nullable = false)
    private Prueba prueba;
}
