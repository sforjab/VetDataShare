package com.uoc.tfm.vds_backend.prueba.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uoc.tfm.vds_backend.mascota.model.Mascota;
import com.uoc.tfm.vds_backend.mascota.service.MascotaService;
import com.uoc.tfm.vds_backend.prueba.model.Prueba;
import com.uoc.tfm.vds_backend.prueba.repository.PruebaRepository;

@Service
public class PruebaService {
    @Autowired
    private PruebaRepository pruebaRepository;

    /* @Autowired
    private MascotaService mascotaService; */

    @Transactional
    public Optional<Prueba> getPruebaPorId(Long id) {
        return pruebaRepository.findById(id);
    }

    /* @Transactional
    public List<Prueba> getPruebasPorIdMascota(Long idMascota) { */
        /* Optional<Mascota> mascota = mascotaService.getMascotaPorId(idMascota); */

        // Si la mascota no existe, se devuelve lista vacía
        /* if (!mascota.isPresent()) {
            return List.of();
        }
        
        return mascota.get().getPruebas();
    } */

    @Transactional
    public List<Prueba> getPruebasPorIdMascota(Long idMascota) {
        return pruebaRepository.findByMascotaId(idMascota);
    }

    @Transactional
    public List<Prueba> getPruebasPorConsultaId(Long consultaId) {
        return pruebaRepository.findByConsultaId(consultaId);
    }

    @Transactional
    public Optional<Prueba> createPrueba(Prueba prueba) {
        try {
            Prueba pruebaCreada = pruebaRepository.save(prueba);
            return Optional.of(pruebaCreada);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<Prueba> updatePrueba(Long id, Prueba pruebaModificada) {
        try {
            Optional<Prueba> prueba = pruebaRepository.findById(id);

            // Si la prueba no existe, devolvemos 'Optional' vacío
            if (!prueba.isPresent()) {
                return Optional.empty();
            }

            // Copiamos las propiedades de 'pruebaModificada' a 'prueba', excluyendo el 'id'
            BeanUtils.copyProperties(pruebaModificada, prueba.get(), "id");

            // Guardamos y devolvemos la prueba actualizada
            Prueba pruebaAct = pruebaRepository.save(prueba.get());
            return Optional.of(pruebaAct);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public boolean delete(Long id) {
        try {
            if (pruebaRepository.existsById(id)) {
                pruebaRepository.deleteById(id);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }
}