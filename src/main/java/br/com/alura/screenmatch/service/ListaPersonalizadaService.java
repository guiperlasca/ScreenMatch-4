package br.com.alura.screenmatch.service;

import br.com.alura.screenmatch.dto.ListaPersonalizadaDTO;
import br.com.alura.screenmatch.dto.ListaPersonalizadaRequestDTO;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ListaPersonalizadaService {

    public ListaPersonalizadaDTO criarLista(String login, ListaPersonalizadaRequestDTO request) {
        // Placeholder implementation
        return null;
    }

    public ListaPersonalizadaDTO atualizarLista(Long listaId, String login, ListaPersonalizadaRequestDTO request) {
        // Placeholder implementation
        return null;
    }

    public void deletarLista(Long listaId, String login) {
        // Placeholder implementation
    }

    public List<ListaPersonalizadaDTO> obterListasUsuario(String login) {
        // Placeholder implementation
        return Collections.emptyList();
    }

    public ListaPersonalizadaDTO obterLista(Long listaId, String login) {
        // Placeholder implementation
        return null;
    }

    public void adicionarSerieLista(Long listaId, Long serieId, String login) {
        // Placeholder implementation
    }

    public void removerSerieLista(Long listaId, Long serieId, String login) {
        // Placeholder implementation
    }

    public List<ListaPersonalizadaDTO> obterListasPublicas() {
        // Placeholder implementation
        return Collections.emptyList();
    }
}
