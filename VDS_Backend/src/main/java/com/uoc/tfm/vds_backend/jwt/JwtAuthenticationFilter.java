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
                Long idMascota = claims.get("idMascota", Long.class);
                CustomUserDetails customDetails = new CustomUserDetails(null, idMascota, rol);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        customDetails, null, List.of(() -> "TEMPORAL"));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtService.isTokenValid(token, userDetails)) {
                    Long idUsuario = claims.get("idUsuario", Long.class);
                    CustomUserDetails customDetails = new CustomUserDetails(idUsuario, null, rol);
            
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            customDetails, null, customDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
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
