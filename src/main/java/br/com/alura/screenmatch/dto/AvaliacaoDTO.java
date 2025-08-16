package br.com.alura.screenmatch.dto;

import java.time.LocalDateTime;

public class AvaliacaoDTO {
    private Long id;
    private Long serieId;
    private String tituloSerie;
    private String loginUsuario;
    private Integer nota;
    private String comentario;
    private String observacao;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    // Construtores
    public AvaliacaoDTO() {}

    public AvaliacaoDTO(Long id, Long serieId, String tituloSerie, String loginUsuario, 
                        Integer nota, String comentario, String observacao, 
                        LocalDateTime dataCriacao, LocalDateTime dataAtualizacao) {
        this.id = id;
        this.serieId = serieId;
        this.tituloSerie = tituloSerie;
        this.loginUsuario = loginUsuario;
        this.nota = nota;
        this.comentario = comentario;
        this.observacao = observacao;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSerieId() {
        return serieId;
    }

    public void setSerieId(Long serieId) {
        this.serieId = serieId;
    }

    public String getTituloSerie() {
        return tituloSerie;
    }

    public void setTituloSerie(String tituloSerie) {
        this.tituloSerie = tituloSerie;
    }

    public String getLoginUsuario() {
        return loginUsuario;
    }

    public void setLoginUsuario(String loginUsuario) {
        this.loginUsuario = loginUsuario;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    @Override
    public String toString() {
        return "AvaliacaoDTO{" +
                "id=" + id +
                ", serieId=" + serieId +
                ", tituloSerie='" + tituloSerie + '\'' +
                ", loginUsuario='" + loginUsuario + '\'' +
                ", nota=" + nota +
                ", comentario='" + comentario + '\'' +
                ", observacao='" + observacao + '\'' +
                ", dataCriacao=" + dataCriacao +
                ", dataAtualizacao=" + dataAtualizacao +
                '}';
    }
}
