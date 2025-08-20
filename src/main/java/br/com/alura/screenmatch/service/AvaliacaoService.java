package br.com.alura.screenmatch.service;

import br.com.alura.screenmatch.dto.AvaliacaoDTO;
import br.com.alura.screenmatch.dto.AvaliacaoRequestDTO;
import br.com.alura.screenmatch.model.Avaliacao;
import br.com.alura.screenmatch.model.Serie;
import br.com.alura.screenmatch.model.Usuario;
import br.com.alura.screenmatch.repository.AvaliacaoRepository;
import br.com.alura.screenmatch.repository.SerieRepository;
import br.com.alura.screenmatch.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SerieRepository serieRepository;

    private Usuario getUsuario(String login) {
        return (Usuario) usuarioRepository.findByLogin(login);
    }

    private AvaliacaoDTO toDTO(Avaliacao avaliacao) {
        return new AvaliacaoDTO(
                avaliacao.getId(),
                avaliacao.getSerie().getId(),
                avaliacao.getSerie().getTitulo(),
                avaliacao.getUsuario().getUsername(),
                avaliacao.getNota(),
                avaliacao.getComentario(),
                avaliacao.getObservacao(),
                avaliacao.getDataCriacao(),
                null // dataAtualizacao is not in the Avaliacao entity
        );
    }

    @Transactional
    public AvaliacaoDTO criarAvaliacao(Long serieId, String login, AvaliacaoRequestDTO request) {
        Usuario usuario = getUsuario(login);
        Serie serie = serieRepository.findById(serieId).orElseThrow(() -> new RuntimeException("Série não encontrada"));
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setSerie(serie);
        avaliacao.setUsuario(usuario);
        avaliacao.setNota(request.getNota());
        avaliacao.setComentario(request.getComentario());
        avaliacao.setObservacao(request.getObservacao());
        avaliacaoRepository.save(avaliacao);
        return toDTO(avaliacao);
    }

    @Transactional
    public AvaliacaoDTO atualizarAvaliacao(Long avaliacaoId, String login, AvaliacaoRequestDTO request) {
        Usuario usuario = getUsuario(login);
        Avaliacao avaliacao = avaliacaoRepository.findById(avaliacaoId).orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));
        if (!avaliacao.getUsuario().equals(usuario)) {
            throw new RuntimeException("Você não tem permissão para atualizar esta avaliação");
        }
        avaliacao.setNota(request.getNota());
        avaliacao.setComentario(request.getComentario());
        avaliacao.setObservacao(request.getObservacao());
        avaliacaoRepository.save(avaliacao);
        return toDTO(avaliacao);
    }

    @Transactional
    public void deletarAvaliacao(Long avaliacaoId, String login) {
        Usuario usuario = getUsuario(login);
        Avaliacao avaliacao = avaliacaoRepository.findById(avaliacaoId).orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));
        if (!avaliacao.getUsuario().equals(usuario)) {
            throw new RuntimeException("Você não tem permissão para deletar esta avaliação");
        }
        avaliacaoRepository.delete(avaliacao);
    }

    public Page<AvaliacaoDTO> obterAvaliacoesSerie(Long serieId, Pageable pageable) {
        Serie serie = serieRepository.findById(serieId).orElseThrow(() -> new RuntimeException("Série não encontrada"));
        Page<Avaliacao> avaliacoes = avaliacaoRepository.findBySerie(serie, pageable);
        return avaliacoes.map(this::toDTO);
    }

    public List<AvaliacaoDTO> obterAvaliacoesUsuario(String login) {
        Usuario usuario = getUsuario(login);
        return avaliacaoRepository.findByUsuario(usuario).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Object obterEstatisticasAvaliacao(Long serieId) {
        // Placeholder - a ser implementado
        return null;
    }
}
