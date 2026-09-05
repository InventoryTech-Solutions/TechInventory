package com.techinventory.backend_inventory.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Deshabilitar CSRF ya que usamos una API REST Stateless con tokens JWT
            .csrf(csrf -> csrf.disable())

            // 2. Habilitar la configuración de CORS para peticiones desde Angular
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Manejo de Sesión de tipo Stateless (Sin estado en servidor)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 4. Reglas de Autorización de Endpoints (Rúbrica EV1)
            .authorizeHttpRequests(auth -> auth
                // Endpoint Público: Accesible sin token (Consulta de catálogo)
                .requestMatchers("/api/public/**").permitAll()
                
                // Permitir acceso a la consola de H2 local
                .requestMatchers("/h2-console/**").permitAll()

                // Endpoints Protegidos de Escritura (Crear movimientos/despachos)
                .requestMatchers(HttpMethod.POST, "/api/inventario/**").authenticated()

                // Endpoints Protegidos de Lectura (Detalle de productos/stock)
                .requestMatchers(HttpMethod.GET, "/api/inventario/**").authenticated()

                // Cualquier otra ruta requiere autenticación por defecto
                .anyRequest().authenticated()
            )

            // 5. Configurar el servidor como OAuth2 Resource Server para validar JWT
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        // Permitir marcos para visualizar la consola H2 localmente
        http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }

    // Configuración global de CORS para permitir la conexión desde la SPA Angular
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200", "http://localhost")); // URL habitual de Angular
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}