package br.com.alura.screenmatch.controller;

import br.com.alura.screenmatch.dto.ReviewDTO;
import br.com.alura.screenmatch.model.Usuario;
import br.com.alura.screenmatch.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/series/{serieId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public List<ReviewDTO> getReviewsBySerieId(@PathVariable Long serieId) {
        return reviewService.getReviewsBySerieId(serieId);
    }

    @PostMapping
    public ReviewDTO createReview(@PathVariable Long serieId, @RequestBody ReviewDTO reviewDTO, @AuthenticationPrincipal Usuario usuario) {
        return reviewService.createReview(serieId, reviewDTO, usuario);
    }
}
