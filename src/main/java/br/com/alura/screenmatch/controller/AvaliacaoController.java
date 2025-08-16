package br.com.alura.screenmatch.controller;

import br.com.alura.screenmatch.dto.AvaliacaoDTO;
import br.com.alura.screenmatch.dto.AvaliacaoRequestDTO;
import br.com.alura.screenmatch.service.AvaliacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
@CrossOrigin(origins = {"http://localhost:5500", "http://localhost:3000"})
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @PostMapping("/series/{serieId}")
    public ResponseEntity<AvaliacaoDTO> criarAvaliacao(
            @PathVariable Long serieId,
            @RequestBody AvaliacaoRequestDTO request,
            Authentication authentication) {
        
        String login = authentication.getName();
        AvaliacaoDTO avaliacao = avaliacaoService.criarAvaliacao(serieId, login, request);
        return ResponseEntity.ok(avaliacao);
    }

    @PutMapping("/{avaliacaoId}")
    public ResponseEntity<AvaliacaoDTO> atualizarAvaliacao(
            @PathVariable Long avaliacaoId,
            @RequestBody AvaliacaoRequestDTO request,
            Authentication authentication) {
        
        String login = authentication.getName();
        AvaliacaoDTO avaliacao = avaliacaoService.atualizarAvaliacao(avaliacaoId, login, request);
        return ResponseEntity.ok(avaliacao);
    }

    @DeleteMapping("/{avaliacaoId}")
    public ResponseEntity<Void> deletarAvaliacao(
            @PathVariable Long avaliacaoId,
            Authentication authentication) {
        
        String login = authentication.getName();
        avaliacaoService.deletarAvaliacao(avaliacaoId, login);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/series/{serieId}")
    public ResponseEntity<Page<AvaliacaoDTO>> obterAvaliacoesSerie(
            @PathVariable Long serieId,
            Pageable pageable) {
        
        Page<AvaliacaoDTO> avaliacoes = avaliacaoService.obterAvaliacoesSerie(serieId, pageable);
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<AvaliacaoDTO>> obterAvaliacoesUsuario(Authentication authentication) {
        String login = authentication.getName();
        List<AvaliacaoDTO> avaliacoes = avaliacaoService.obterAvaliacoesUsuario(login);
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/series/{serieId}/estatisticas")
    public ResponseEntity<Object> obterEstatisticasAvaliacao(@PathVariable Long serieId) {
        Object estatisticas = avaliacaoService.obterEstatisticasAvaliacao(serieId);
        return ResponseEntity.ok(estatisticas);
    }
}
