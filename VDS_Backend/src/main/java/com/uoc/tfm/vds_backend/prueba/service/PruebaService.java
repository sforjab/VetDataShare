package com.uoc.tfm.vds_backend.prueba.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.consulta.model.Consulta;
import com.uoc.tfm.vds_backend.consulta.repository.ConsultaRepository;
import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.prueba.dto.PruebaDTO;
import com.uoc.tfm.vds_backend.prueba.mapper.PruebaMapper;
import com.uoc.tfm.vds_backend.prueba.model.Prueba;
import com.uoc.tfm.vds_backend.prueba.repository.PruebaRepository;

@Service
public class PruebaService {

    @Autowired
    private PruebaRepository pruebaRepository;

    @Autowired
    private PruebaMapper pruebaMapper;

    @Autowired
    private ConsultaRepository consultaRepository;

    @Transactional(readOnly = true)
    public Optional<PruebaDTO> getPruebaPorId(Long id) {
        return pruebaRepository.findById(id)
                .map(pruebaMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<PruebaDTO> getPruebasPorIdMascota(Long idMascota) {
        return pruebaRepository.findByMascotaId(idMascota).stream()
                .map(pruebaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PruebaDTO> getUltimasPruebas(Long idMascota) {
        return pruebaRepository.findTop3ByMascotaIdOrderByFechaDesc(idMascota).stream()
                .map(pruebaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PruebaDTO> getPruebasPorConsultaId(Long consultaId) {
        return pruebaRepository.findByConsultaId(consultaId).stream()
                .map(pruebaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<PruebaDTO> createPrueba(PruebaDTO pruebaDTO) {
        try {
            // Obtenemos la consulta asociada
            Consulta consulta = consultaRepository.findById(pruebaDTO.getConsultaId())
                    .orElseThrow(() -> new RuntimeException("Consulta no encontrada con ID: " + pruebaDTO.getConsultaId()));

            // Obtenemos la mascota asociada a la consulta
            Mascota mascota = consulta.getMascota();

            // Configuramos los valores adicionales
            Prueba prueba = pruebaMapper.toEntity(pruebaDTO);
            prueba.setMascota(mascota);
            prueba.setConsulta(consulta);
            prueba.setFecha(LocalDateTime.now());

            // Guardamos la prueba
            Prueba pruebaCreada = pruebaRepository.save(prueba);
            return Optional.of(pruebaMapper.toDTO(pruebaCreada));
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<PruebaDTO> updatePrueba(Long id, PruebaDTO pruebaDTO) {
        return pruebaRepository.findById(id).map(pruebaExistente -> {
            // Actualizamos los datos existentes desde el DTO
            pruebaExistente.setTipo(pruebaDTO.getTipo());
            pruebaExistente.setDescripcion(pruebaDTO.getDescripcion());
            pruebaExistente.setFecha(pruebaDTO.getFecha());

            // Guardamos y convertimos a DTO
            Prueba pruebaActualizada = pruebaRepository.save(pruebaExistente);
            return pruebaMapper.toDTO(pruebaActualizada);
        });
    }

    @Transactional
    public boolean delete(Long id) {
        if (pruebaRepository.existsById(id)) {
            pruebaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
