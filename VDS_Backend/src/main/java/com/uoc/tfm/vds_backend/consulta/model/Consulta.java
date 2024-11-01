package com.uoc.tfm.vds_backend.consulta.model;

import java.time.LocalDateTime;
import java.util.List;

import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.prueba.model.Prueba;
import com.uoc.tfm.vds_backend.usuario.model.Usuario;
import com.uoc.tfm.vds_backend.vacuna.model.Vacuna;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fechaConsulta; // Fecha y hora de la consulta

    @Column(nullable = false)
    private String motivo; // Motivo de la consulta

    @Column(length = 1000)
    private String observaciones; // Observaciones públicas realizadas por el veterinario (QUITARLAS???)

    @Column(length = 500)
    private String notas; // Anotaciones privadas realizadas por el veterinario

    @Column(length = 500)
    private String medicacion; // Medicación pautada

    // Relación con Mascota
    @ManyToOne
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;

    // Relación con Veterinario
    @ManyToOne
    @JoinColumn(name = "veterinario_id", nullable = false)
    private Usuario veterinario;

    // Relación con Pruebas asociadas a la consulta
    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL)
    private List<Prueba> pruebas;

    // Relación con Vacunas administradas en la consulta
    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL)
    private List<Vacuna> vacunas;
}
