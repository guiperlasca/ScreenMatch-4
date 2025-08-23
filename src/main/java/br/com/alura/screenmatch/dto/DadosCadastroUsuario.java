package br.com.alura.screenmatch.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DadosCadastroUsuario(
        @JsonAlias("login") String login,
        @JsonAlias("senha") String senha,
        @JsonAlias("nome") String nome
) {
}
