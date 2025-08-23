package br.com.alura.screenmatch.controller;

import br.com.alura.screenmatch.dto.ReviewDTO;
import br.com.alura.screenmatch.dto.SerieDTO;
import br.com.alura.screenmatch.model.Usuario;
import br.com.alura.screenmatch.repository.UsuarioRepository;
import br.com.alura.screenmatch.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
    public ResponseEntity<?> cadastrar(@RequestBody br.com.alura.screenmatch.dto.DadosCadastroUsuario dados) {
        try {
            // Verificar se o usuário já existe
            if (repository.findByLogin(dados.login()) != null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email já está em uso");
                return ResponseEntity.badRequest().body(error);
            }
            
            Usuario novoUsuario = new Usuario();
            novoUsuario.setLogin(dados.login());
            novoUsuario.setSenha(passwordEncoder.encode(dados.senha()));
            novoUsuario.setNome(dados.nome());
            
            Usuario usuarioSalvo = repository.save(novoUsuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuário cadastrado com sucesso");
            response.put("id", usuarioSalvo.getId());
            response.put("email", usuarioSalvo.getLogin());
            response.put("nome", usuarioSalvo.getNome());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro interno do servidor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/meus-favoritos")
    public List<SerieDTO> getFavoritos(@AuthenticationPrincipal Usuario usuario) {
        return usuario.getFavoritas().stream()
                .map(SerieDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/meus-reviews")
    public List<ReviewDTO> getReviews(@AuthenticationPrincipal Usuario usuario) {
        return reviewService.getReviewsByUsuario(usuario);
    }
}
