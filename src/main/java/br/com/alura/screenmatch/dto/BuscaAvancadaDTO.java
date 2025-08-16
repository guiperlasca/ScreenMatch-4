package br.com.alura.screenmatch.dto;

public class BuscaAvancadaDTO {
    private String titulo;
    private String genero;
    private Integer anoMin;
    private Integer anoMax;
    private String diretor;
    private String ator;
    private Double avaliacaoMin;
    private String ordenacao;

    // Construtores
    public BuscaAvancadaDTO() {}

    public BuscaAvancadaDTO(String titulo, String genero, Integer anoMin, Integer anoMax, 
                           String diretor, String ator, Double avaliacaoMin, String ordenacao) {
        this.titulo = titulo;
        this.genero = genero;
        this.anoMin = anoMin;
        this.anoMax = anoMax;
        this.diretor = diretor;
        this.ator = ator;
        this.avaliacaoMin = avaliacaoMin;
        this.ordenacao = ordenacao;
    }

    // Getters e Setters
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Integer getAnoMin() {
        return anoMin;
    }

    public void setAnoMin(Integer anoMin) {
        this.anoMin = anoMin;
    }

    public Integer getAnoMax() {
        return anoMax;
    }

    public void setAnoMax(Integer anoMax) {
        this.anoMax = anoMax;
    }

    public String getDiretor() {
        return diretor;
    }

    public void setDiretor(String diretor) {
        this.diretor = diretor;
    }

    public String getAtor() {
        return ator;
    }

    public void setAtor(String ator) {
        this.ator = ator;
    }

    public Double getAvaliacaoMin() {
        return avaliacaoMin;
    }

    public void setAvaliacaoMin(Double avaliacaoMin) {
        this.avaliacaoMin = avaliacaoMin;
    }

    public String getOrdenacao() {
        return ordenacao;
    }

    public void setOrdenacao(String ordenacao) {
        this.ordenacao = ordenacao;
    }

    @Override
    public String toString() {
        return "BuscaAvancadaDTO{" +
                "titulo='" + titulo + '\'' +
                ", genero='" + genero + '\'' +
                ", anoMin=" + anoMin +
                ", anoMax=" + anoMax +
                ", diretor='" + diretor + '\'' +
                ", ator='" + ator + '\'' +
                ", avaliacaoMin=" + avaliacaoMin +
                ", ordenacao='" + ordenacao + '\'' +
                '}';
    }
}
