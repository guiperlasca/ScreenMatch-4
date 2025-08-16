package br.com.alura.screenmatch.controller;

import br.com.alura.screenmatch.dto.ListaPersonalizadaDTO;
import br.com.alura.screenmatch.dto.ListaPersonalizadaRequestDTO;
import br.com.alura.screenmatch.service.ListaPersonalizadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/listas")
@CrossOrigin(origins = {"http://localhost:5500", "http://localhost:3000"})
public class ListaPersonalizadaController {

    @Autowired
    private ListaPersonalizadaService listaService;

    @PostMapping
    public ResponseEntity<ListaPersonalizadaDTO> criarLista(
            @RequestBody ListaPersonalizadaRequestDTO request,
            Authentication authentication) {
        
        String login = authentication.getName();
        ListaPersonalizadaDTO lista = listaService.criarLista(login, request);
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{listaId}")
    public ResponseEntity<ListaPersonalizadaDTO> atualizarLista(
            @PathVariable Long listaId,
            @RequestBody ListaPersonalizadaRequestDTO request,
            Authentication authentication) {
        
        String login = authentication.getName();
        ListaPersonalizadaDTO lista = listaService.atualizarLista(listaId, login, request);
        return ResponseEntity.ok(lista);
    }

    @DeleteMapping("/{listaId}")
    public ResponseEntity<Void> deletarLista(
            @PathVariable Long listaId,
            Authentication authentication) {
        
        String login = authentication.getName();
        listaService.deletarLista(listaId, login);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ListaPersonalizadaDTO>> obterListasUsuario(Authentication authentication) {
        String login = authentication.getName();
        List<ListaPersonalizadaDTO> listas = listaService.obterListasUsuario(login);
        return ResponseEntity.ok(listas);
    }

    @GetMapping("/{listaId}")
    public ResponseEntity<ListaPersonalizadaDTO> obterLista(
            @PathVariable Long listaId,
            Authentication authentication) {
        
        String login = authentication.getName();
        ListaPersonalizadaDTO lista = listaService.obterLista(listaId, login);
        return ResponseEntity.ok(lista);
    }

    @PostMapping("/{listaId}/series/{serieId}")
    public ResponseEntity<Void> adicionarSerieLista(
            @PathVariable Long listaId,
            @PathVariable Long serieId,
            Authentication authentication) {
        
        String login = authentication.getName();
        listaService.adicionarSerieLista(listaId, serieId, login);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{listaId}/series/{serieId}")
    public ResponseEntity<Void> removerSerieLista(
            @PathVariable Long listaId,
            @PathVariable Long serieId,
            Authentication authentication) {
        
        String login = authentication.getName();
        listaService.removerSerieLista(listaId, serieId, login);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/publicas")
    public ResponseEntity<List<ListaPersonalizadaDTO>> obterListasPublicas() {
        List<ListaPersonalizadaDTO> listas = listaService.obterListasPublicas();
        return ResponseEntity.ok(listas);
    }
}
