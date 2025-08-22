package br.com.alura.screenmatch.service;

import br.com.alura.screenmatch.dto.DadosCadastroSerieDTO;
import br.com.alura.screenmatch.dto.EpisodioDTO;
import br.com.alura.screenmatch.dto.SerieDTO;
import br.com.alura.screenmatch.model.*;
import br.com.alura.screenmatch.repository.SerieRepository;
import br.com.alura.screenmatch.repository.UsuarioRepository;
import br.com.alura.screenmatch.service.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SerieService {
    @Autowired
    private SerieRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ConsumoApi consumoApi;

    @Autowired
    private ConverteDados conversor;

    public List<SerieDTO> obterTodasAsSeries() {
        return converteDados(repository.findAll());
    }

    public List<SerieDTO> obterTop5Series() {
        return converteDados(repository.findTop5ByOrderByAvaliacaoDesc());
    }

    public List<SerieDTO> obterLancamentos() {
        return converteDados(repository.findLatestReleases(PageRequest.of(0, 5)));
    }

    public SerieDTO obterPorId(Long id) {
        Serie serie = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Série não encontrada com id: " + id));
        return new SerieDTO(serie.getId(), serie.getTitulo(), serie.getTotalTemporadas(), serie.getAnoLancamento(), serie.getAvaliacao(), serie.getGenero(), serie.getAtores(), serie.getPoster(), serie.getSinopse(), null);
    }

    public List<EpisodioDTO> obterTodasTemporadas(Long id) {
        Serie serie = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Série não encontrada com id: " + id));
        return serie.getEpisodios().stream()
                .map(e -> new EpisodioDTO(e.getTemporada(), e.getNumeroEpisodio(), e.getTitulo()))
                .collect(Collectors.toList());
    }

    public List<EpisodioDTO> obterTemporadasPorNumero(Long id, Long numero) {
        return repository.obterEpisodiosPorTemporada(id, numero)
                .stream()
                .map(e -> new EpisodioDTO(e.getTemporada(), e.getNumeroEpisodio(), e.getTitulo()))
                .collect(Collectors.toList());
    }

    public List<SerieDTO> obterSeriesPorCategoria(String nomeGenero) {
        try {
            Categoria categoria = Categoria.fromPortugues(nomeGenero.trim());
            return converteDados(repository.findByGenero(categoria));
        } catch (IllegalArgumentException e) {
            // Retorna lista vazia se a categoria não for válida
            return List.of();
        }
    }

    public SerieDTO cadastrarSerie(DadosCadastroSerieDTO dados) {
        // 1. Verifica se a série já existe no banco de dados
        List<Serie> seriesExistentes = repository.findByTituloContainingIgnoreCase(dados.titulo());
        if (!seriesExistentes.isEmpty()) {
            // Se já existe, retorna os dados do primeiro encontrado
            return new SerieDTO(seriesExistentes.get(0));
        }

        // 2. Se não existir, busca na API do OMDB
        String json = consumoApi.obterDados(dados.titulo());
        DadosSerie dadosSerieApi = conversor.obterDados(json, DadosSerie.class);

        // 3. Converte e salva a nova série
        Serie novaSerie = new Serie(dadosSerieApi);
        repository.save(novaSerie);

        // 4. Retorna o DTO da nova série
        return new SerieDTO(novaSerie);
    }


    public SerieDTO favoritarSerie(Long serieId, Usuario usuario) {
        Serie serie = repository.findById(serieId)
                .orElseThrow(() -> new RuntimeException("Série não encontrada com id: " + serieId));

        // A entidade Usuario deve ser gerenciada pelo contexto de persistência
        Usuario usuarioGerenciado = usuarioRepository.findById(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (usuarioGerenciado.getFavoritas().contains(serie)) {
            usuarioGerenciado.getFavoritas().remove(serie);
        } else {
            usuarioGerenciado.getFavoritas().add(serie);
        }
        usuarioRepository.save(usuarioGerenciado);

        return new SerieDTO(serie);
    }

    public List<SerieDTO> buscarSeries(String termo) {
        List<Serie> seriesEncontradas = new ArrayList<>(repository.findByTermo(termo));

        try {
            Categoria categoria = Categoria.fromPortugues(termo.trim());
            seriesEncontradas.addAll(repository.findByGenero(categoria));
        } catch (IllegalArgumentException e) {
            // O termo não é um gênero válido, ignora.
        }

        List<SerieDTO> seriesDto = seriesEncontradas.stream()
                .distinct()
                .map(SerieDTO::new)
                .collect(Collectors.toList());

        if (seriesDto.isEmpty()) {
            try {
                String json = consumoApi.obterDados(termo);
                DadosSerie dadosSerieApi = conversor.obterDados(json, DadosSerie.class);
                if (dadosSerieApi != null && dadosSerieApi.titulo() != null) {
                    Serie novaSerie = new Serie(dadosSerieApi);
                    repository.save(novaSerie);
                    seriesDto.add(new SerieDTO(novaSerie));
                }
            } catch (Exception e) {
                // Log the exception or handle it as needed
                System.err.println("Erro ao buscar série na API externa: " + e.getMessage());
            }
        }

        return seriesDto;
    }

    private List<SerieDTO> converteDados(List<Serie> series) {
        return series.stream()
                .map(SerieDTO::new) // Usando construtor de SerieDTO(Serie)
                .collect(Collectors.toList());
    }

    public org.springframework.data.domain.Page<SerieDTO> buscarSeriesAvancada(br.com.alura.screenmatch.dto.BuscaAvancadaDTO dto, org.springframework.data.domain.Pageable pageable) {
        // Placeholder implementation
        return org.springframework.data.domain.Page.empty();
    }

    public List<String> obterSugestoes(String query) {
        // Placeholder implementation
        return java.util.Collections.emptyList();
    }

    public List<String> obterTodosGeneros() {
        // Placeholder implementation
        return java.util.Collections.emptyList();
    }

    public List<Integer> obterTodosAnos() {
        // Placeholder implementation
        return java.util.Collections.emptyList();
    }
}
