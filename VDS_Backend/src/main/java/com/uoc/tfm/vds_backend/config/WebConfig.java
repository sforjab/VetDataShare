package com.uoc.tfm.vds_backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.uoc.tfm.vds_backend.acceso_temporal.interceptor.AccesoTemporalInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private AccesoTemporalInterceptor accesoTemporalInterceptor
    ;
    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(accesoTemporalInterceptor)
                .addPathPatterns("/api/**"); // Se aplica a todos los endpoints bajo '/api/'
    }
}