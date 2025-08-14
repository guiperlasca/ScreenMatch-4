package br.com.alura.screenmatch.repository;

import br.com.alura.screenmatch.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import br.com.alura.screenmatch.model.Usuario;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findBySerieId(Long serieId);
    List<Review> findByUsuario(Usuario usuario);
}
