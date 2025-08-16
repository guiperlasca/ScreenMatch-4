package br.com.alura.screenmatch.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ListaPersonalizadaDTO {
    private Long id;
    private String nome;
    private String descricao;
    private Boolean publica;
    private String tags;
    private String loginUsuario;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private Integer quantidadeSeries;
    private List<SerieDTO> series;

    // Construtores
    public ListaPersonalizadaDTO() {}

    public ListaPersonalizadaDTO(Long id, String nome, String descricao, Boolean publica, 
                                String tags, String loginUsuario, LocalDateTime dataCriacao, 
                                LocalDateTime dataAtualizacao, Integer quantidadeSeries, List<SerieDTO> series) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.publica = publica;
        this.tags = tags;
        this.loginUsuario = loginUsuario;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.quantidadeSeries = quantidadeSeries;
        this.series = series;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Boolean getPublica() {
        return publica;
    }

    public void setPublica(Boolean publica) {
        this.publica = publica;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getLoginUsuario() {
        return loginUsuario;
    }

    public void setLoginUsuario(String loginUsuario) {
        this.loginUsuario = loginUsuario;
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

    public Integer getQuantidadeSeries() {
        return quantidadeSeries;
    }

    public void setQuantidadeSeries(Integer quantidadeSeries) {
        this.quantidadeSeries = quantidadeSeries;
    }

    public List<SerieDTO> getSeries() {
        return series;
    }

    public void setSeries(List<SerieDTO> series) {
        this.series = series;
    }

    @Override
    public String toString() {
        return "ListaPersonalizadaDTO{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", descricao='" + descricao + '\'' +
                ", publica=" + publica +
                ", tags='" + tags + '\'' +
                ", loginUsuario='" + loginUsuario + '\'' +
                ", dataCriacao=" + dataCriacao +
                ", dataAtualizacao=" + dataAtualizacao +
                ", quantidadeSeries=" + quantidadeSeries +
                ", series=" + series +
                '}';
    }
}
