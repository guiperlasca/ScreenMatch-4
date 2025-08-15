package br.com.alura.screenmatch.controller;

import br.com.alura.screenmatch.dto.ReviewDTO;
import br.com.alura.screenmatch.dto.SerieDTO;
import br.com.alura.screenmatch.model.Usuario;
import br.com.alura.screenmatch.repository.UsuarioRepository;
import br.com.alura.screenmatch.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public void cadastrar(@RequestBody br.com.alura.screenmatch.dto.DadosCadastroUsuario dados) {
        Usuario novoUsuario = new Usuario();
        novoUsuario.setLogin(dados.login());
        novoUsuario.setSenha(passwordEncoder.encode(dados.senha()));
        repository.save(novoUsuario);
    }

    @GetMapping("/meus-favoritos")
    public List<SerieDTO> getFavoritos(@AuthenticationPrincipal Usuario usuario) {
        return usuario.getFavoritas().stream()
                .map(s -> new SerieDTO(s.getId(), s.getTitulo(), s.getTotalTemporadas(), s.getAvaliacao(), s.getGenero(), s.getAtores(), s.getPoster(), s.getSinopse()))
                .collect(Collectors.toList());
    }

    @GetMapping("/meus-reviews")
    public List<ReviewDTO> getReviews(@AuthenticationPrincipal Usuario usuario) {
        return reviewService.getReviewsByUsuario(usuario);
    }
}
