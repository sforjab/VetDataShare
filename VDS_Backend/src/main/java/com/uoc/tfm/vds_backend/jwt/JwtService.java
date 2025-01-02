package com.uoc.tfm.vds_backend.jwt;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    
    @Autowired(required = false) // Pude ser 'null' en producción
    Dotenv dotenv;

    private String getEnvVariable(String key) {
        // Prioriza dotenv (desarrollo) y usa System.getenv() como fallback (producción)
        if (dotenv != null && dotenv.get(key) != null) {
            return dotenv.get(key);
        } else {
            return System.getenv(key);
        }
    }

    private Key getSigningKey() {
        /* String secretKey = dotenv.get("JWT_SECRET_KEY"); */
        String secretKey = getEnvVariable("JWT_SECRET_KEY");
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }

    // Extraemos el username
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extraemos el rol del token
    public String extractRol(String token) {
        return extractClaim(token, claims -> claims.get("rol", String.class));
    }

    // Extraemos el ID del usuario desde el token
    public Long extractIdUsuario(String token) {
        return extractClaim(token, claims -> claims.get("idUsuario", Long.class));
    }

    // Extraemos el ID de la mascota desde el token (para acceso temporal)
    public Long extractIdMascota(String token) {
        return extractClaim(token, claims -> claims.get("idMascota", Long.class));
    }

    // Generamos el token con rol e ID de usuario
    public String generateToken(UserDetails userDetails, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", userDetails.getAuthorities().iterator().next().getAuthority());
        claims.put("idUsuario", userId);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Una hora
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validamos si el token es válido
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractClaim(token, Claims::getSubject);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public String generateTemporalToken(String tokenAccesoTemporal, Long idMascota, long expirationMillis) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", "TEMPORAL"); // Rol temporal para accesos temporales
        claims.put("idMascota", idMascota);
    
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(tokenAccesoTemporal)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(expirationMillis))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
}
