package com.uoc.tfm.vds_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class DotenvConfig {
    @Bean
    public Dotenv dotenv() {
        return Dotenv.configure()
                 .directory(System.getProperty("user.dir") + "/VDS_Backend")
                 .load();
    }
}
