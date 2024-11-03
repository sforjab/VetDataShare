package com.uoc.tfm.vds_backend.prueba.model;

import java.time.LocalDate;
import java.util.List;

import com.uoc.tfm.vds_backend.consulta.model.Consulta;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Prueba {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    TipoPrueba tipo;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;

    @ManyToOne
    @JoinColumn(name = "consulta_id")
    private Consulta consulta;

    @OneToMany(mappedBy = "prueba", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentoPrueba> documentosPrueba;
}
