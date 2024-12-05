
package com.uoc.tfm.vds_backend.consulta.model;

import java.util.List;

import com.uoc.tfm.vds_backend.clinica.dto.ClinicaDTO;
import com.uoc.tfm.vds_backend.consulta.dto.ConsultaDTO;
import com.uoc.tfm.vds_backend.mascota.dto.MascotaDTO;
import com.uoc.tfm.vds_backend.prueba.dto.PruebaDTO;
import com.uoc.tfm.vds_backend.usuario.dto.UsuarioDTO;
import com.uoc.tfm.vds_backend.vacuna.dto.VacunaDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConsultaDetalleResponse {
    private ConsultaDTO consulta;
    private List<PruebaDTO> pruebas;
    private List<VacunaDTO> vacunas;
    private MascotaDTO mascota;
    private UsuarioDTO veterinario;
    private ClinicaDTO clinica;
}