package com.uoc.tfm.vds_backend.prueba.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public List<PruebaDTO> getPruebasPorConsultaId(Long consultaId) {
        return pruebaRepository.findByConsultaId(consultaId).stream()
                .map(pruebaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<PruebaDTO> createPrueba(PruebaDTO pruebaDTO) {
        try {
            Prueba prueba = pruebaMapper.toEntity(pruebaDTO);

            // Mascota y consulta deben configurarse fuera del mapper si están presentes
            Prueba pruebaCreada = pruebaRepository.save(prueba);

            return Optional.of(pruebaMapper.toDTO(pruebaCreada));
        } catch (Exception e) {
            // Manejo de excepciones para posibles errores durante la creación
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<PruebaDTO> updatePrueba(Long id, PruebaDTO pruebaDTO) {
        return pruebaRepository.findById(id).map(pruebaExistente -> {
            // Actualizar los datos existentes desde el DTO
            pruebaExistente.setTipo(pruebaDTO.getTipo());
            pruebaExistente.setDescripcion(pruebaDTO.getDescripcion());
            pruebaExistente.setFecha(pruebaDTO.getFecha());

            // Guardar y convertir a DTO
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
