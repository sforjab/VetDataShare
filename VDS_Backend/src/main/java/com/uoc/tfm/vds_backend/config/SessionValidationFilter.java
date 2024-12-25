package com.uoc.tfm.vds_backend.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.uoc.tfm.vds_backend.jwt.CustomUserDetails;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SessionValidationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Obtener autenticación desde el contexto de seguridad
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof CustomUserDetails) {
            // Extraemos los datos del usuario autenticado
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String rolUsuarioAutenticado = userDetails.getRol();
            Long idUsuarioAutenticado = userDetails.getIdUsuario();

            // Se leen los encabezados de la solicitud
            String rolSesion = request.getHeader("Rol-Sesion");
            String idUsuarioSesion = request.getHeader("IdUsuario-Sesion");

            System.out.println("Rol-Sesion recibido: " + rolSesion);
            System.out.println("IdUsuario-Sesion recibido: " + idUsuarioSesion);

            // Validación para usuarios temporales
            if ("TEMPORAL".equals(rolSesion)) {
                // Solo valida el rol; no necesita validar IdUsuario-Sesion
                if (!"TEMPORAL".equals(rolUsuarioAutenticado)) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("El rol de sesión no coincide con el usuario temporal autenticado.");
                    return;
                }
            } else {
                // Validaciones estándar para otros roles
                if (rolSesion != null && !rolSesion.equals(rolUsuarioAutenticado)) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("El rol de sesión no coincide con el del usuario autenticado.");
                    return;
                }
                if (idUsuarioSesion != null && !idUsuarioSesion.equals(String.valueOf(idUsuarioAutenticado))) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("El ID de usuario de sesión no coincide con el del usuario autenticado.");
                    return;
                }
            }

            // Validaciones para usuarios regulares
            if (rolSesion != null && !rolSesion.equals(rolUsuarioAutenticado)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("El rol de sesión no coincide con el del usuario autenticado.");
                return;
            }

            if (idUsuarioSesion != null && !idUsuarioSesion.equals(String.valueOf(idUsuarioAutenticado))) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("El ID de usuario de sesión no coincide con el del usuario autenticado.");
                return;
            }
        }

        // Continuar con el siguiente filtro si todo está bien
        filterChain.doFilter(request, response);
    }
}
