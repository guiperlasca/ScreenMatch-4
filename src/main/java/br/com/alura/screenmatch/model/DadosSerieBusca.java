package br.com.alura.screenmatch.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DadosSerieBusca(@JsonAlias("Title") String titulo,
                              @JsonAlias("Year") String ano,
                              @JsonAlias("imdbID") String imdbID,
                              @JsonAlias("Type") String tipo,
                              @JsonAlias("Poster") String poster) {
}
