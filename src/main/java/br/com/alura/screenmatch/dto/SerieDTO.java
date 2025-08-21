package br.com.alura.screenmatch.dto;

import br.com.alura.screenmatch.model.Categoria;
import br.com.alura.screenmatch.model.Serie;

public record SerieDTO(Long id,
                       String titulo,
                       Integer totalTemporadas,
                       Integer anoDeLancamento,
                       Double avaliacao,
                       Categoria genero,
                       String atores,
                       String poster,
                       String sinopse,
                       String imdbId) {

    public SerieDTO(Serie serie) {
        this(serie.getId(),
                serie.getTitulo(),
                serie.getTotalTemporadas(),
                serie.getAnoLancamento(),
                serie.getAvaliacao(),
                serie.getGenero(),
                serie.getAtores(),
                serie.getPoster(),
                serie.getSinopse(),
                null); // imdbId não é armazenado na entidade Serie por padrão
    }

    public SerieDTO(Long id, String titulo, String poster, String imdbId, Integer anoDeLancamento) {
        this(id, titulo, 0, anoDeLancamento, 0.0, null, null, poster, null, imdbId);
    }
}
