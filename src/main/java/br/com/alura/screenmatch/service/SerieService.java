package br.com.alura.screenmatch.service;

import br.com.alura.screenmatch.dto.DadosCadastroSerieDTO;
import br.com.alura.screenmatch.dto.EpisodioDTO;
import br.com.alura.screenmatch.dto.SerieDTO;
import br.com.alura.screenmatch.model.Categoria;
import br.com.alura.screenmatch.model.DadosSerie;
import br.com.alura.screenmatch.model.Serie;
import br.com.alura.screenmatch.model.Usuario;
import br.com.alura.screenmatch.repository.SerieRepository;
import br.com.alura.screenmatch.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return converteDados(repository.findTop5ByEpisodioDataLancamento());
    }

    public SerieDTO obterPorId(Long id) {
        Optional<Serie> serie = repository.findById(id);
        if (serie.isPresent()) {
            Serie s = serie.get();
            return new SerieDTO(s.getId(), s.getTitulo(), s.getTotalTemporadas(), s.getAvaliacao(), s.getGenero(), s.getAtores(), s.getPoster(), s.getSinopse());
        }
        return null; // Idealmente, lançar uma exceção Not Found
    }

    public List<EpisodioDTO> obterTodasTemporadas(Long id) {
        Optional<Serie> serie = repository.findById(id);
        if (serie.isPresent()) {
            Serie s = serie.get();
            return s.getEpisodios().stream()
                    .map(e -> new EpisodioDTO(e.getTemporada(), e.getNumeroEpisodio(), e.getTitulo()))
                    .collect(Collectors.toList());
        }
        return null; // Idealmente, lançar uma exceção
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

    public List<SerieDTO> buscarSeries(String titulo) {
        return converteDados(repository.findByTituloContainingIgnoreCase(titulo));
    }

    private List<SerieDTO> converteDados(List<Serie> series) {
        return series.stream()
                .map(SerieDTO::new) // Usando construtor de SerieDTO(Serie)
                .collect(Collectors.toList());
    }
}
