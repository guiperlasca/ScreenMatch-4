import { api } from './api.js';
import { isUserLoggedIn } from './auth.js';

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const mainContent = document.getElementById('details-content');
let isFavorited = false;

document.addEventListener('DOMContentLoaded', () => {
    if (!serieId) {
        mainContent.innerHTML = '<p>Série não encontrada.</p>';
        return;
    }
    loadSerieDetails();
});

async function loadSerieDetails() {
    try {
        const serie = await api.get(`/series/${serieId}`);
        if (isUserLoggedIn()) {
            const favorites = await api.get('/usuarios/meus-favoritos');
            isFavorited = favorites.some(fav => fav.id === serie.id);
        }
        renderSerieDetails(serie);
    } catch (error) {
        mainContent.innerHTML = '<p>Não foi possível carregar os detalhes da série.</p>';
    }
}

function renderSerieDetails(serie) {
    mainContent.innerHTML = `
        <div class="details-grid">
            <div class="poster-container">
                <img src="${serie.poster}" alt="Pôster de ${serie.titulo}">
            </div>
            <div class="info-container">
                <h1>${serie.titulo}</h1>
                <div class="metadata">
                    <span>${serie.genero}</span>
                    <span class="rating">
                        <i class="material-icons">star</i> ${serie.avaliacao} / 10
                    </span>
                </div>
                <div class="actions">
                    <button id="favorite-btn" class="btn btn-secondary">
                        <i class="material-icons">${isFavorited ? 'favorite' : 'favorite_border'}</i>
                        <span>${isFavorited ? 'Favorito' : 'Adicionar aos Favoritos'}</span>
                    </button>
                </div>
                <div class="plot">
                    <h3>Sinopse</h3>
                    <p>${serie.sinopse}</p>
                </div>
            </div>
        </div>
        <div class="seasons">
            <h3>Temporadas</h3>
            <select id="season-select" class="btn"></select>
            <ul id="episode-list" class="episode-list"></ul>
        </div>
        <div class="reviews-section">
            <h3>Reviews</h3>
            <div id="review-form-container"></div>
            <div id="reviews-list" class="reviews-list"></div>
        </div>
    `;

    document.getElementById('favorite-btn').addEventListener('click', () => toggleFavorite(serie.id));
    loadSeasonsAndEpisodes(serieId);
    loadReviews(serieId);
}

async function loadSeasonsAndEpisodes(serieId) {
    const seasonSelect = document.getElementById('season-select');
    const episodeList = document.getElementById('episode-list');

    try {
        const seasons = await api.get(`/series/${serieId}/temporadas/todas`);
        const seasonNumbers = [...new Set(seasons.map(ep => ep.temporada))];

        seasonSelect.innerHTML = seasonNumbers.map(num => `<option value="${num}">Temporada ${num}</option>`).join('');

        seasonSelect.addEventListener('change', async () => {
            const selectedSeason = seasonSelect.value;
            const episodes = await api.get(`/series/${serieId}/temporadas/${selectedSeason}`);
            renderEpisodeList(episodeList, episodes);
        });

        // Load episodes for the first season initially
        if (seasonNumbers.length > 0) {
            const initialEpisodes = await api.get(`/series/${serieId}/temporadas/${seasonNumbers[0]}`);
            renderEpisodeList(episodeList, initialEpisodes);
        }
    } catch (error) {
        seasonSelect.innerHTML = '<option>Erro ao carregar</option>';
    }
}

function renderEpisodeList(listElement, episodes) {
    listElement.innerHTML = episodes.map(ep => `
        <li>
            <span>${ep.numeroEpisodio}</span> ${ep.titulo}
        </li>
    `).join('');
}

async function toggleFavorite(serieId) {
    if (!isUserLoggedIn()) {
        window.location.href = '/login.html';
        return;
    }

    const btn = document.getElementById('favorite-btn');
    const icon = btn.querySelector('i');
    const text = btn.querySelector('span');

    // Optimistic update
    isFavorited = !isFavorited;
    icon.textContent = isFavorited ? 'favorite' : 'favorite_border';
    text.textContent = isFavorited ? 'Favorito' : 'Adicionar aos Favoritos';

    try {
        await api.patch(`/series/${serieId}/favorito`);
    } catch (error) {
        // Revert on error
        isFavorited = !isFavorited;
        icon.textContent = isFavorited ? 'favorite' : 'favorite_border';
        text.textContent = isFavorited ? 'Favorito' : 'Adicionar aos Favoritos';
        alert('Não foi possível atualizar o status de favorito.');
    }
}

async function loadReviews(serieId) {
    const reviewFormContainer = document.getElementById('review-form-container');
    const reviewsList = document.getElementById('reviews-list');

    if (isUserLoggedIn()) {
        renderReviewForm(reviewFormContainer);
    }

    try {
        const reviews = await api.get(`/series/${serieId}/reviews`);
        renderReviewList(reviewsList, reviews);
    } catch (error) {
        reviewsList.innerHTML = '<p>Não foi possível carregar as reviews.</p>';
    }
}

function renderReviewForm(container) {
    container.innerHTML = `
        <h4>Deixe sua review</h4>
        <form id="review-form">
            <div class="star-rating">
                <i class="material-icons" data-value="1">star_border</i>
                <i class="material-icons" data-value="2">star_border</i>
                <i class="material-icons" data-value="3">star_border</i>
                <i class="material-icons" data-value="4">star_border</i>
                <i class="material-icons" data-value="5">star_border</i>
            </div>
            <input type="hidden" name="avaliacao" id="avaliacao-input" value="0">
            <textarea name="texto" id="texto-review" placeholder="Escreva sua review aqui..." required></textarea>
            <button type="submit" class="btn btn-primary">Enviar Review</button>
        </form>
    `;

    const stars = container.querySelectorAll('.star-rating i');
    const ratingInput = container.querySelector('#avaliacao-input');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            ratingInput.value = star.dataset.value;
            updateStars(stars, ratingInput.value);
        });
    });

    container.querySelector('#review-form').addEventListener('submit', handleReviewSubmit);
}

function updateStars(stars, rating) {
    stars.forEach(star => {
        star.textContent = star.dataset.value <= rating ? 'star' : 'star_border';
    });
}

async function handleReviewSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const avaliacao = form.avaliacao.value;
    const texto = form.texto.value;

    if (avaliacao === '0') {
        alert('Por favor, selecione uma avaliação.');
        return;
    }

    try {
        await api.post(`/series/${serieId}/reviews`, { texto, avaliacao });
        form.reset();
        updateStars(form.querySelectorAll('.star-rating i'), 0);
        loadReviews(serieId); // Recarrega a lista de reviews
    } catch (error) {
        alert('Erro ao enviar review.');
    }
}

function renderReviewList(listElement, reviews) {
    if (reviews.length === 0) {
        listElement.innerHTML = '<p>Seja o primeiro a deixar uma review!</p>';
        return;
    }
    listElement.innerHTML = reviews.map(review => {
        let ratingStars = '';
        for (let i = 1; i <= 5; i++) {
            ratingStars += `<i class="material-icons">${i <= review.avaliacao ? 'star' : 'star_border'}</i>`;
        }
        return `
            <div class="review">
                <div class="review__header">
                    <strong class="review__author">${review.autor}</strong>
                    <div class="review__rating">${ratingStars}</div>
                    <span class="review__date">${new Date(review.data).toLocaleDateString()}</span>
                </div>
                <p>${review.texto}</p>
            </div>
        `;
    }).join('');
}
