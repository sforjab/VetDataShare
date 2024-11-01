package com.uoc.tfm.vds_backend.vacuna.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;
import com.uoc.tfm.vds_backend.vacuna.model.Vacuna;
import com.uoc.tfm.vds_backend.vacuna.repository.VacunaRepository;

@Service
public class VacunaService {
    @Autowired
    private VacunaRepository vacunaRepository;

    @Autowired
    private MascotaService mascotaService;

    @Transactional
    public Optional<Vacuna> getVacunaPorId(Long id) { // COMPROBAR SI REALMENTE ESTE Y EL DE PRUEBA HACE FALTA PORQUE NO ACCEDO AL DETALLE...AUNQUE SE PUEDE ELIMINAR Y EDITAR
        return vacunaRepository.findById(id);
    }

    @Transactional
    public List<Vacuna> getVacunasPorIdMascota(Long idMascota) {
        Optional<Mascota> mascota = mascotaService.getMascotaPorId(idMascota);

        // Si la mascota no existe, se devuelve lista vacía
        if (!mascota.isPresent()) {
            return List.of();
        }
        
        return mascota.get().getVacunas();
    }

    @Transactional
    public Optional<Vacuna> createVacuna(Vacuna vacuna) {
        try {
            Vacuna vacunaCreada = vacunaRepository.save(vacuna);
            return Optional.of(vacunaCreada);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<Vacuna> updatePrueba(Long id, Vacuna vacunaModificada) {
        try {
            Optional<Vacuna> vacuna = vacunaRepository.findById(id);

            // Si la vacuna no existe, devolvemos 'Optional' vacío
            if (!vacuna.isPresent()) {
                return Optional.empty();
            }

            // Copiamos las propiedades de 'vacunaModificada' a 'vacuna', excluyendo el 'id'
            BeanUtils.copyProperties(vacunaModificada, vacuna.get(), "id");

            // Guardamos y devolvemos la prueba actualizada
            Vacuna vacunaAct = vacunaRepository.save(vacuna.get());
            return Optional.of(vacunaAct);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public boolean delete(Long id) {
        try {
            if (vacunaRepository.existsById(id)) {
                vacunaRepository.deleteById(id);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }
}
