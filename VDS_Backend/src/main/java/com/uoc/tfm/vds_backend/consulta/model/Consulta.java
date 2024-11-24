package com.uoc.tfm.vds_backend.consulta.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.prueba.model.Prueba;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import com.uoc.tfm.vds_backend.vacuna.model.Vacuna;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/* @Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fechaConsulta; // Fecha y hora de la consulta

    @Column(nullable = false)
    private String motivo; // Motivo de la consulta

    @Column(length = 500)
    private String notas; // Anotaciones privadas realizadas por el veterinario

    @Column(length = 500)
    private String medicacion; // Medicación pautada

    // Relación con Mascota
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mascota_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "consultas"})
    @ToString.Exclude
    private Mascota mascota;

    // Relación con Veterinario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veterinario_id", nullable = false)
    private Usuario veterinario;

    // Relación con Pruebas asociadas a la consulta
    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Prueba> pruebas;

    // Relación con Vacunas administradas en la consulta
    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Vacuna> vacunas;
} */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fechaConsulta;

    @Column(nullable = false)
    private String motivo;

    @Column(length = 500)
    private String notas;

    @Column(length = 500)
    private String medicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mascota_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "consultas", "usuario"})
    @ToString.Exclude
    private Mascota mascota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veterinario_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "mascotas", "clinica"})
    private Usuario veterinario;

    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "consulta"})
    @ToString.Exclude
    private List<Prueba> pruebas;

    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "consulta"})
    @ToString.Exclude
    private List<Vacuna> vacunas;
}
