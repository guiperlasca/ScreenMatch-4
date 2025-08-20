document.addEventListener('DOMContentLoaded', () => {
    const movieDetailsContainer = document.getElementById('movieDetails');
    const API_BASE_URL = 'http://localhost:8080';

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        if (movieDetailsContainer) {
            movieDetailsContainer.innerHTML = '<p class="text-red-500">Movie ID not found in URL.</p>';
        }
        return;
    }

    async function loadMovieDetails() {
        try {
            const response = await fetch(`${API_BASE_URL}/series/${movieId}`);
            if (!response.ok) {
                throw new Error('Failed to load movie details.');
            }
            const movie = await response.json();
            renderMovieDetails(movie);
        } catch (error) {
            console.error('Error loading movie details:', error);
            if (movieDetailsContainer) {
                movieDetailsContainer.innerHTML = '<p class="text-red-500">Could not load movie details.</p>';
            }
        }
    }

    function renderMovieDetails(movie) {
        if (!movieDetailsContainer) return;
        document.title = `${movie.titulo} - CineVault`;
        movieDetailsContainer.innerHTML = `
            <div class="poster-container">
                <img src="${movie.poster || 'img/placeholder.jpg'}" alt="Poster for ${movie.titulo}" class="poster-img">
            </div>
            <div class="info-container">
                <h1 class="text-4xl font-bold text-foreground">${movie.titulo}</h1>
                <div class="meta-info">
                    <span>${movie.ano}</span>
                    <span>${movie.genero}</span>
                    <span class="imdb-rating">IMDb: ${movie.avaliacao || 'N/A'}</span>
                </div>
                <p class="plot">${movie.sinopse}</p>
                
                <div class="rating-widget mt-6">
                    <h3 class="text-lg font-semibold mb-2">Avalie este filme:</h3>
                    <div class="stars" data-movie-id="${movie.id}">
                        ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-value="${i}">&#9734;</span>`).join('')}
                    </div>
                    <p class="rating-feedback hidden mt-2"></p>
                </div>

                <div class="add-to-list-widget mt-6">
                     <button id="addToListBtn" class="btn btn-primary">Adicionar à minha lista</button>
                     <p class="list-feedback hidden mt-2"></p>
                </div>
            </div>
        `;
        addRatingFunctionality();
        addToListFunctionality();
    }

    function addRatingFunctionality() {
        const starsContainer = document.querySelector('.stars');
        const feedbackP = document.querySelector('.rating-feedback');
        if (!starsContainer) return;

        starsContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('star')) {
                const rating = e.target.dataset.value;
                const movieId = starsContainer.dataset.movieId;
                const token = localStorage.getItem('authToken');

                if (!token) {
                    feedbackP.textContent = 'You must be logged in to rate a movie.';
                    feedbackP.className = 'rating-feedback mt-2 text-red-500';
                    feedbackP.classList.remove('hidden');
                    return;
                }

                try {
                    const response = await fetch(`${API_BASE_URL}/avaliacoes/series/${movieId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ pontuacao: rating, comentario: "No comment" })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to submit rating.');
                    }

                    feedbackP.textContent = `You rated this movie ${rating} stars.`;
                    feedbackP.className = 'rating-feedback mt-2 text-green-500';
                    feedbackP.classList.remove('hidden');

                } catch (error) {
                    console.error('Error submitting rating:', error);
                    feedbackP.textContent = 'Failed to submit rating. Please try again.';
                    feedbackP.className = 'rating-feedback mt-2 text-red-500';
                    feedbackP.classList.remove('hidden');
                }
            }
        });
    }

    function addToListFunctionality() {
        const addToListBtn = document.getElementById('addToListBtn');
        const feedbackP = document.querySelector('.list-feedback');
        if (!addToListBtn) return;

        addToListBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                feedbackP.textContent = 'You must be logged in to add movies to a list.';
                feedbackP.className = 'list-feedback mt-2 text-red-500';
                feedbackP.classList.remove('hidden');
                return;
            }

            // This is a placeholder as the specific list is not selected.
            // In a real app, you'd have a dropdown or modal to select the list.
            // For now, we just show a message.
            feedbackP.textContent = 'This functionality is not fully implemented yet.';
            feedbackP.className = 'list-feedback mt-2 text-yellow-500';
            feedbackP.classList.remove('hidden');
        });
    }

    loadMovieDetails();
});
