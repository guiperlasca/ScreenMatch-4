package br.com.alura.screenmatch.service;

import br.com.alura.screenmatch.dto.ReviewDTO;
import br.com.alura.screenmatch.model.Review;
import br.com.alura.screenmatch.model.Usuario;
import br.com.alura.screenmatch.model.Serie;
import br.com.alura.screenmatch.repository.ReviewRepository;
import br.com.alura.screenmatch.repository.SerieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SerieRepository serieRepository;

    public List<ReviewDTO> getReviewsBySerieId(Long serieId) {
        return reviewRepository.findBySerieId(serieId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ReviewDTO createReview(Long serieId, ReviewDTO reviewDTO, Usuario usuario) {
        Serie serie = serieRepository.findById(serieId)
                .orElseThrow(() -> new RuntimeException("Série não encontrada"));
        Review review = new Review(reviewDTO.texto(), reviewDTO.avaliacao(), serie, usuario);
        reviewRepository.save(review);
        return convertToDto(review);
    }

    private ReviewDTO convertToDto(Review review) {
        return new ReviewDTO(
                review.getId(),
                review.getTexto(),
                review.getAvaliacao(),
                review.getData(),
                review.getUsuario().getUsername()
        );
    }
}
