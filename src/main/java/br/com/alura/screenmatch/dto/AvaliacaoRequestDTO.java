package br.com.alura.screenmatch.dto;

import jakarta.validation.constraints.*;

public class AvaliacaoRequestDTO {
    
    @NotNull(message = "A nota é obrigatória")
    @Min(value = 1, message = "A nota deve ser no mínimo 1")
    @Max(value = 10, message = "A nota deve ser no máximo 10")
    private Integer nota;
    
    @NotBlank(message = "O comentário é obrigatório")
    @Size(min = 10, max = 1000, message = "O comentário deve ter entre 10 e 1000 caracteres")
    private String comentario;
    
    @Size(max = 500, message = "A observação deve ter no máximo 500 caracteres")
    private String observacao;

    // Construtores
    public AvaliacaoRequestDTO() {}

    public AvaliacaoRequestDTO(Integer nota, String comentario, String observacao) {
        this.nota = nota;
        this.comentario = comentario;
        this.observacao = observacao;
    }

    // Getters e Setters
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

    @Override
    public String toString() {
        return "AvaliacaoRequestDTO{" +
                "nota=" + nota +
                ", comentario='" + comentario + '\'' +
                ", observacao='" + observacao + '\'' +
                '}';
    }
}
