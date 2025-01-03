package com.uoc.tfm.vds_backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.uoc.tfm.vds_backend.jwt.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final SessionValidationFilter sessionValidationFilter;
    private final AuthenticationProvider authProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // Configuración de CORS
                .authorizeHttpRequests(authRequest -> authRequest
                        // Rutas públicas (accesibles sin autenticación)
                        .requestMatchers("/api/auth/**", "/api/auth/olvidar-password", "/api/auth/restablecer-password", 
                                                     "/api/usuarios/create", "/api/accesos-temporales/**",
                                                     "/api/usuarios/solicitar-presupuesto").permitAll()

                        // Rutas accesibles para el rol TEMPORAL y otros roles autenticados
                        .requestMatchers("/mascota/**", "/consulta/**", "/prueba/**", "/vacuna/**")
                            .access((authentication, object) -> {
                                // Obtenemos el objeto 'Authentication'
                                Authentication auth = authentication.get();
                                System.out.println("Intentando acceso con rol: " + (auth != null ? auth.getAuthorities() : "No autenticado"));
                                if (auth != null) {
                                    // Verificamos si el rol es TEMPORAL y permitimos el acceso
                                    if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("TEMPORAL"))) {
                                        System.out.println("Acceso permitido para rol TEMPORAL.");
                                        return new AuthorizationDecision(true);
                                    }
                                    // Verificamos si el usuario tiene los roles ADMIN, ADMIN_CLINICA o CLIENTE
                                    if (auth.getAuthorities().stream().anyMatch(a ->
                                            a.getAuthority().equals("ADMIN") ||
                                            a.getAuthority().equals("ADMIN_CLINICA") ||
                                            a.getAuthority().equals("CLIENTE"))) {
                                            System.out.println("Acceso permitido para rol autenticado.");
                                        return new AuthorizationDecision(true);
                                    }
                                }
                                System.out.println("Acceso denegado.");
                                return new AuthorizationDecision(false);
                            })

                        .requestMatchers(HttpMethod.POST, "/api/documentos-prueba/subirDocumento").authenticated()
                        // Todas las demás rutas requieren autenticación completa para los roles especificados
                        .anyRequest().authenticated())

                .sessionManagement(sessionManager -> sessionManager
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Usamos JWT, sin estado
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(sessionValidationFilter, JwtAuthenticationFilter.class)
                .build();
    }

    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
    
        // Configura los orígenes permitidos desde las propiedades
        /* configuration.setAllowedOrigins(List.of("http://localhost:4200")); */
        configuration.setAllowedOrigins(List.of("https://vetdatashare.netlify.app"));
    
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
    
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
