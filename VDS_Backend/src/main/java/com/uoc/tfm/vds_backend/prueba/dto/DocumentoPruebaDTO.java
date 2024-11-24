package com.uoc.tfm.vds_backend.prueba.dto;

import lombok.Data;

@Data
public class DocumentoPruebaDTO {
    private Long id;
    private String nombreArchivo;
    private String tipoArchivo;
    private byte[] datos;
    private Long pruebaId;
}
