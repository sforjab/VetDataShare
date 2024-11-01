package com.uoc.tfm.vds_backend.consulta.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uoc.tfm.vds_backend.consulta.model.Consulta;
import com.uoc.tfm.vds_backend.consulta.repository.ConsultaRepository;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;

import jakarta.transaction.Transactional;

@Service
public class ConsultaService {
    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private MascotaService mascotaService;

    @Transactional
    public Optional<Consulta> getConsultaPorId(Long id) {
        return consultaRepository.findById(id);
    }

    public List<Consulta> getConsultasPorFecha(LocalDateTime fecha) {
        return consultaRepository.findByFechaConsulta(fecha);
    }

    @Transactional
    public List<Consulta> getConsultasPorIdMascota(Long idMascota) {
        Optional<Mascota> mascota = mascotaService.getMascotaPorId(idMascota);

        // Si la mascota no existe, se devuelve lista vacía
        if (mascota.isPresent()) {
            return consultaRepository.findByMascotaId(idMascota);
        } else {
            return List.of();
        }
    }

    @Transactional
    public Optional<Consulta> createConsulta(Consulta consulta) {
        try {
            Consulta consultaCreada = consultaRepository.save(consulta);
            return Optional.of(consultaCreada);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<Consulta> updateConsulta(Long id, Consulta consultaModificada) {
        try {
            Optional<Consulta> consulta = consultaRepository.findById(id);

            if (consulta.isPresent()) {
                // Copiamos las propiedades de 'consultaModificada' a 'consulta', excluyendo el 'id'
                BeanUtils.copyProperties(consultaModificada, consulta.get(), "id");

                Consulta consultaAct = consultaRepository.save(consulta.get());
                return Optional.of(consultaAct);
            } else {
                return Optional.empty();
            }
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public boolean deleteConsulta(Long id) {
        try {
            if (consultaRepository.existsById(id)) {
                consultaRepository.deleteById(id);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }
}
