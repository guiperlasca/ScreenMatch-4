package br.com.alura.screenmatch.dto;

import java.time.LocalDate;

public record ReviewDTO(
        Long id,
        String texto,
        Integer avaliacao,
        LocalDate data,
        String autor
) {
}
