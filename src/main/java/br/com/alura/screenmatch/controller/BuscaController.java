package br.com.alura.screenmatch.controller;

import br.com.alura.screenmatch.dto.BuscaAvancadaDTO;
import br.com.alura.screenmatch.dto.SerieDTO;
import br.com.alura.screenmatch.service.SerieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/busca")
@CrossOrigin(origins = {"http://localhost:5500", "http://localhost:3000"})
public class BuscaController {

    @Autowired
    private SerieService serieService;

    @GetMapping("/series")
    public ResponseEntity<Page<SerieDTO>> buscarSeries(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String genero,
            @RequestParam(required = false) Integer anoMin,
            @RequestParam(required = false) Integer anoMax,
            @RequestParam(required = false) String diretor,
            @RequestParam(required = false) String ator,
            @RequestParam(required = false) Double avaliacaoMin,
            @RequestParam(required = false) String ordenacao,
            @PageableDefault(size = 20) Pageable pageable) {
        
        BuscaAvancadaDTO criterios = new BuscaAvancadaDTO();
        criterios.setTitulo(titulo);
        criterios.setGenero(genero);
        criterios.setAnoMin(anoMin);
        criterios.setAnoMax(anoMax);
        criterios.setDiretor(diretor);
        criterios.setAtor(ator);
        criterios.setAvaliacaoMin(avaliacaoMin);
        criterios.setOrdenacao(ordenacao);
        
        Page<SerieDTO> resultado = serieService.buscarSeriesAvancada(criterios, pageable);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/series/sugestoes")
    public ResponseEntity<List<String>> obterSugestoes(@RequestParam String termo) {
        List<String> sugestoes = serieService.obterSugestoes(termo);
        return ResponseEntity.ok(sugestoes);
    }

    @GetMapping("/series/generos")
    public ResponseEntity<List<String>> obterGeneros() {
        List<String> generos = serieService.obterTodosGeneros();
        return ResponseEntity.ok(generos);
    }

    @GetMapping("/series/anos")
    public ResponseEntity<List<Integer>> obterAnos() {
        List<Integer> anos = serieService.obterTodosAnos();
        return ResponseEntity.ok(anos);
    }
}
