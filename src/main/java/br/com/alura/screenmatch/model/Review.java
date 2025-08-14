package br.com.alura.screenmatch.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texto;

    private Integer avaliacao;

    private LocalDate data;

    @ManyToOne
    @JoinColumn(name = "serie_id")
    @JsonBackReference
    private Serie serie;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Review() {
    }

    public Review(String texto, Integer avaliacao, Serie serie, Usuario usuario) {
        this.texto = texto;
        this.avaliacao = avaliacao;
        this.serie = serie;
        this.usuario = usuario;
        this.data = LocalDate.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public Integer getAvaliacao() {
        return avaliacao;
    }

    public void setAvaliacao(Integer avaliacao) {
        this.avaliacao = avaliacao;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Serie getSerie() {
        return serie;
    }

    public void setSerie(Serie serie) {
        this.serie = serie;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
