package br.com.alura.screenmatch.repository;

import br.com.alura.screenmatch.model.Avaliacao;
import br.com.alura.screenmatch.model.Serie;
import br.com.alura.screenmatch.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    Page<Avaliacao> findBySerie(Serie serie, Pageable pageable);
    List<Avaliacao> findByUsuario(Usuario usuario);
}
