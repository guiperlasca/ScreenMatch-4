package br.com.alura.screenmatch.service;

import br.com.alura.screenmatch.dto.AvaliacaoDTO;
import br.com.alura.screenmatch.dto.AvaliacaoRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AvaliacaoService {

    public AvaliacaoDTO criarAvaliacao(Long serieId, String login, AvaliacaoRequestDTO request) {
        // Placeholder implementation
        return null;
    }

    public AvaliacaoDTO atualizarAvaliacao(Long avaliacaoId, String login, AvaliacaoRequestDTO request) {
        // Placeholder implementation
        return null;
    }

    public void deletarAvaliacao(Long avaliacaoId, String login) {
        // Placeholder implementation
    }

    public Page<AvaliacaoDTO> obterAvaliacoesSerie(Long serieId, Pageable pageable) {
        // Placeholder implementation
        return Page.empty();
    }

    public List<AvaliacaoDTO> obterAvaliacoesUsuario(String login) {
        // Placeholder implementation
        return Collections.emptyList();
    }

    public Object obterEstatisticasAvaliacao(Long serieId) {
        // Placeholder implementation
        return null;
    }
}
