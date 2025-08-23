package br.com.alura.screenmatch.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    // Permitir acesso a recursos estáticos
                    req.requestMatchers("/", "/index.html", "/detalhes.html", "/css/**", "/js/**", "/img/**", "/*.png", "/*.jpg", "/*.svg").permitAll();
                    
                    // Permitir acesso a endpoints públicos
                    req.requestMatchers(HttpMethod.GET, "/series/**").permitAll();
                    req.requestMatchers(HttpMethod.GET, "/busca/**").permitAll();
                    req.requestMatchers(HttpMethod.GET, "/avaliacoes/series/**").permitAll();
                    
                    // Permitir login e cadastro
                    req.requestMatchers(HttpMethod.POST, "/login").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/usuarios").permitAll();
                    
                    // Permitir documentação da API
                    req.requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll();
                    
                    // Todas as outras requisições precisam de autenticação
                    req.anyRequest().authenticated();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
