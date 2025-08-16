package br.com.alura.screenmatch.dto;

import jakarta.validation.constraints.*;

public class ListaPersonalizadaRequestDTO {
    
    @NotBlank(message = "O nome da lista é obrigatório")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    private String nome;
    
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
    private String descricao;
    
    @NotNull(message = "A visibilidade é obrigatória")
    private Boolean publica;
    
    @Size(max = 200, message = "As tags devem ter no máximo 200 caracteres")
    private String tags;

    // Construtores
    public ListaPersonalizadaRequestDTO() {}

    public ListaPersonalizadaRequestDTO(String nome, String descricao, Boolean publica, String tags) {
        this.nome = nome;
        this.descricao = descricao;
        this.publica = publica;
        this.tags = tags;
    }

    // Getters e Setters
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

    @Override
    public String toString() {
        return "ListaPersonalizadaRequestDTO{" +
                "nome='" + nome + '\'' +
                ", descricao='" + descricao + '\'' +
                ", publica=" + publica +
                ", tags='" + tags + '\'' +
                '}';
    }
}
