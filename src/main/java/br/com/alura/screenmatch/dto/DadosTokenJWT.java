package br.com.alura.screenmatch.dto;

public record DadosTokenJWT(String token, String email, String nome, Long id) {
    
    public DadosTokenJWT(String token) {
        this(token, null, null, null);
    }
}
