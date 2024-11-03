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
    
    @Autowired
    Dotenv dotenv;

    private Key getSigningKey() {
        String secretKey = dotenv.get("JWT_SECRET_KEY");
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

    // Generar el token con rol e ID de usuario
    public String generateToken(UserDetails userDetails, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", userDetails.getAuthorities().iterator().next().getAuthority());
        claims.put("idUsuario", userId);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validamos si el token es válido
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractClaim(token, Claims::getSubject);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
