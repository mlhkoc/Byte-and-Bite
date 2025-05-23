package com.byteandbyte.fooddelivery.auth;

import com.byteandbyte.fooddelivery.security.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class); // Logger ekleyin

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Autowired // Autowired constructor için genellikle gerekmez eğer tek constructor ise
    public JwtRequestFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null;
        String roleFromTokenClaim = null; // Token'dan "ADMIN", "CUSTOMER" gibi rolü almak için

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwtToken = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwtToken);
                roleFromTokenClaim = jwtUtil.extractRole(jwtToken); // Token'dan 'role' claim'ini çek
            } catch (IllegalArgumentException e) {
                logger.error("Unable to get JWT Token", e);
            } catch (ExpiredJwtException e) {
                logger.warn("JWT Token has expired", e);
            } catch (UnsupportedJwtException e) {
                logger.error("JWT Token is unsupported", e);
            } catch (MalformedJwtException e) {
                logger.error("JWT Token is malformed", e);
            } catch (SignatureException e) {
                logger.error("JWT Signature validation failed", e);
            } catch (Exception e) {
                logger.error("Error parsing JWT Token", e);
            }
        } else {
            // logger.warn("JWT Token does not begin with Bearer String"); // Her istekte loglamamak için yorumlu
        }

        if (username != null && roleFromTokenClaim != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails;
            try {
                userDetails = this.userDetailsService.loadUserByUsername(username);
            } catch (UsernameNotFoundException e) {
                logger.warn("User not found with username: {}", username);
                chain.doFilter(request, response);
                return;
            }
            // Token'ı UserDetails'e karşı validate et (kullanıcı adı eşleşmesi ve expiration)
            if (jwtUtil.validateToken(jwtToken, userDetails)) {
                // Yetkiyi, token'daki role claim'ine "ROLE_" ön eki ekleyerek oluştur.
                // SecurityConfig .hasRole("ADMIN") beklediği için "ROLE_ADMIN" yetkisine ihtiyacımız var.
                List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + roleFromTokenClaim.toUpperCase()));

                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, authorities); // UserDetails'ten gelen yetkiler yerine, token'dan türettiğimizi kullanıyoruz.

                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                logger.debug("User '{}' set in SecurityContext with authorities: {}", username, authorities);
            } else {
                logger.warn("JWT Token validation failed for user: {}", username);
            }
        }
        chain.doFilter(request, response);
    }
}