package com.uoc.tfm.vds_backend.jwt;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter 
{
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

   /*  @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String token = getTokenFromRequest(request);
        System.out.println("Token recibido desde el request: " + token);
        if (token == null) {
            System.out.println("No se recibió token en el request"); 
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtService.extractUsername(token);
        System.out.println("Usuario extraído del token: " + username);
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(token, userDetails)) {
                // Extraemos las claims del token
                Claims claims = jwtService.extractAllClaims(token);
                Long idUsuario = claims.get("idUsuario", Long.class);
                Long idMascota = claims.get("idMascota", Long.class);
                String rol = claims.get("rol", String.class);
                System.out.println("Claims extraídas: ID Usuario = " + idUsuario + ", ID Mascota = " + idMascota + ", Rol = " + rol);

                // Creamos un objeto para almacenar el idUsuario, idMascota y el rol
                CustomUserDetails customDetails = new CustomUserDetails(idUsuario, idMascota, rol);

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                // Guardamos el objeto en los detalles del token
                authToken.setDetails(customDetails);

                // Guardamos el authentication en el SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Autenticación exitosa y contexto de seguridad actualizado");
            }
        }
        filterChain.doFilter(request, response);
    } */

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String token = getTokenFromRequest(request);
        System.out.println("Token recibido desde el request: " + token);
        if (token == null) {
            System.out.println("No se recibió token en el request"); 
            filterChain.doFilter(request, response);
            return;
        }

        Claims claims = jwtService.extractAllClaims(token);
        String username = claims.getSubject(); // Esto puede ser un identificador temporal u otra información
        System.out.println("Usuario extraído del token: " + username);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            String rol = claims.get("rol", String.class);
            if ("TEMPORAL".equals(rol)) {
                // En caso de token temporal, configuramos la autenticación sin necesidad de UserDetails
                Long idMascota = claims.get("idMascota", Long.class);
                CustomUserDetails customDetails = new CustomUserDetails(null, idMascota, rol);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        customDetails, null, List.of(() -> "TEMPORAL"));
                authToken.setDetails(customDetails);
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Autenticación exitosa con rol TEMPORAL y contexto de seguridad actualizado");
            } else {
                // Para otros roles, cargamos 'UserDetails' desde el servicio
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtService.isTokenValid(token, userDetails)) {
                    Long idUsuario = claims.get("idUsuario", Long.class);
                    CustomUserDetails customDetails = new CustomUserDetails(idUsuario, null, rol);

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(customDetails);
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("Autenticación exitosa y contexto de seguridad actualizado");
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("Authorization Header: " + authHeader);
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
