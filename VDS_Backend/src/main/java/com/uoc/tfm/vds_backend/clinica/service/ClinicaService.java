package com.uoc.tfm.vet_connect.clinica.service;

import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vet_connect.clinica.model.Clinica;
import com.uoc.tfm.vet_connect.clinica.repository.ClinicaRepository;

@Service
public class ClinicaService {

    @Autowired
    ClinicaRepository clinicaRepository;

    public Optional<Clinica> getClinicaPorId(Long id) {
        return clinicaRepository.findById(id);
    }

    public Optional<Clinica> getClinicaPorNombre(String nombre) {
        return clinicaRepository.findByNombre(nombre);
    }

    @Transactional
    public Optional<Clinica> createClinica(Clinica clinica) {
        try {
            // Validación de nombre único
            if (clinicaRepository.findByNombre(clinica.getNombre()).isPresent()) {
                return Optional.empty();
            }
            Clinica clinicaCreada = clinicaRepository.save(clinica);
            return Optional.of(clinicaCreada);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<Clinica> updateClinica(Long id, Clinica clinicaModificada) {
        try {
            Optional<Clinica> clinica = clinicaRepository.findById(id);
            if (!clinica.isPresent()) {
                return Optional.empty(); // Si la clínica no existe
            }

            // Copiar propiedades excluyendo el ID
            BeanUtils.copyProperties(clinicaModificada, clinica.get(), "id");

            Clinica clinicaActualizada = clinicaRepository.save(clinica.get());
            return Optional.of(clinicaActualizada);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public boolean deleteClinica(Long id) {
        try {
            if (clinicaRepository.existsById(id)) {
                clinicaRepository.deleteById(id);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }
}
