package com.uoc.tfm.vds_backend.config;

import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class DotenvConfig {
    @Bean
    public Dotenv dotenv() {
        String dotenvPath = System.getProperty("user.dir") + "/VDS_Backend/.env";

        // Se verifica si el archivo existe
        if (Files.exists(Paths.get(dotenvPath))) {
            return Dotenv.configure()
            .directory(System.getProperty("user.dir") + "/VDS_Backend")
            .load();
        } else {
            return null; // Retorna null si no hay archivo `.env` (producción)
        }
    }
}
