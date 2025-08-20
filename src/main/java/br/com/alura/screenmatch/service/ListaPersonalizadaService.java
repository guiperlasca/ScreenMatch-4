package br.com.alura.screenmatch.service;

import br.com.alura.screenmatch.dto.ListaPersonalizadaDTO;
import br.com.alura.screenmatch.dto.ListaPersonalizadaRequestDTO;
import br.com.alura.screenmatch.dto.SerieDTO;
import br.com.alura.screenmatch.model.ListaPersonalizada;
import br.com.alura.screenmatch.model.Serie;
import br.com.alura.screenmatch.model.Usuario;
import br.com.alura.screenmatch.repository.ListaPersonalizadaRepository;
import br.com.alura.screenmatch.repository.SerieRepository;
import br.com.alura.screenmatch.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListaPersonalizadaService {

    @Autowired
    private ListaPersonalizadaRepository listaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SerieRepository serieRepository;

    private Usuario getUsuario(String login) {
        return (Usuario) usuarioRepository.findByLogin(login);
    }

    private ListaPersonalizadaDTO toDTO(ListaPersonalizada lista) {
        List<SerieDTO> series = lista.getSeries().stream().map(SerieDTO::new).collect(Collectors.toList());
        return new ListaPersonalizadaDTO(
                lista.getId(),
                lista.getNome(),
                lista.getDescricao(),
                lista.isPublica(),
                lista.getTags(),
                lista.getUsuario().getUsername(),
                lista.getDataCriacao(),
                null, // dataAtualizacao
                lista.getSeries().size(),
                series
        );
    }

    @Transactional
    public ListaPersonalizadaDTO criarLista(String login, ListaPersonalizadaRequestDTO request) {
        Usuario usuario = getUsuario(login);
        ListaPersonalizada lista = new ListaPersonalizada();
        lista.setUsuario(usuario);
        lista.setNome(request.getNome());
        lista.setDescricao(request.getDescricao());
        lista.setPublica(request.getPublica());
        lista.setTags(request.getTags());
        listaRepository.save(lista);
        return toDTO(lista);
    }

    @Transactional
    public ListaPersonalizadaDTO atualizarLista(Long listaId, String login, ListaPersonalizadaRequestDTO request) {
        Usuario usuario = getUsuario(login);
        ListaPersonalizada lista = listaRepository.findById(listaId).orElseThrow(() -> new RuntimeException("Lista não encontrada"));
        if (!lista.getUsuario().equals(usuario)) {
            throw new RuntimeException("Você não tem permissão para atualizar esta lista");
        }
        lista.setNome(request.getNome());
        lista.setDescricao(request.getDescricao());
        lista.setPublica(request.getPublica());
        lista.setTags(request.getTags());
        listaRepository.save(lista);
        return toDTO(lista);
    }

    @Transactional
    public void deletarLista(Long listaId, String login) {
        Usuario usuario = getUsuario(login);
        ListaPersonalizada lista = listaRepository.findById(listaId).orElseThrow(() -> new RuntimeException("Lista não encontrada"));
        if (!lista.getUsuario().equals(usuario)) {
            throw new RuntimeException("Você não tem permissão para deletar esta lista");
        }
        listaRepository.delete(lista);
    }

    public List<ListaPersonalizadaDTO> obterListasUsuario(String login) {
        Usuario usuario = getUsuario(login);
        return listaRepository.findByUsuario(usuario).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ListaPersonalizadaDTO obterLista(Long listaId, String login) {
        Usuario usuario = getUsuario(login);
        ListaPersonalizada lista = listaRepository.findById(listaId).orElseThrow(() -> new RuntimeException("Lista não encontrada"));
        if (!lista.isPublica() && !lista.getUsuario().equals(usuario)) {
            throw new RuntimeException("Você não tem permissão para ver esta lista");
        }
        return toDTO(lista);
    }

    @Transactional
    public void adicionarSerieLista(Long listaId, Long serieId, String login) {
        Usuario usuario = getUsuario(login);
        ListaPersonalizada lista = listaRepository.findById(listaId).orElseThrow(() -> new RuntimeException("Lista não encontrada"));
        if (!lista.getUsuario().equals(usuario)) {
            throw new RuntimeException("Você não tem permissão para adicionar séries a esta lista");
        }
        Serie serie = serieRepository.findById(serieId).orElseThrow(() -> new RuntimeException("Série não encontrada"));
        lista.getSeries().add(serie);
        listaRepository.save(lista);
    }

    @Transactional
    public void removerSerieLista(Long listaId, Long serieId, String login) {
        Usuario usuario = getUsuario(login);
        ListaPersonalizada lista = listaRepository.findById(listaId).orElseThrow(() -> new RuntimeException("Lista não encontrada"));
        if (!lista.getUsuario().equals(usuario)) {
            throw new RuntimeException("Você não tem permissão para remover séries desta lista");
        }
        Serie serie = serieRepository.findById(serieId).orElseThrow(() -> new RuntimeException("Série não encontrada"));
        lista.getSeries().remove(serie);
        listaRepository.save(lista);
    }

    public List<ListaPersonalizadaDTO> obterListasPublicas() {
        return listaRepository.findByPublica(true).stream().map(this::toDTO).collect(Collectors.toList());
    }
}
