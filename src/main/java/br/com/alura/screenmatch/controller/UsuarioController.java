package br.com.alura.screenmatch.controller;

import br.com.alura.screenmatch.model.Usuario;
import br.com.alura.screenmatch.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import br.com.alura.screenmatch.dto.SerieDTO;
import br.com.alura.screenmatch.model.Serie;
import br.com.alura.screenmatch.model.Usuario;
import br.com.alura.screenmatch.repository.UsuarioRepository;
import br.com.alura.screenmatch.service.SerieService;
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

    @PostMapping
    public void cadastrar(@RequestBody Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getPassword()));
        repository.save(usuario);
    }

    @GetMapping("/meus-favoritos")
    public List<SerieDTO> getFavoritos(@AuthenticationPrincipal Usuario usuario) {
        return usuario.getFavoritas().stream()
                .map(s -> new SerieDTO(s.getId(), s.getTitulo(), s.getTotalTemporadas(), s.getAvaliacao(), s.getGenero(), s.getAtores(), s.getPoster(), s.getSinopse()))
                .collect(Collectors.toList());
    }
}
