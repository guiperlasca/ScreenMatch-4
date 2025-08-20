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
            loadReviews(); // Load reviews after rendering movie details
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
                <div class="flex justify-between items-start">
                    <h1 class="text-4xl font-bold text-foreground">${movie.titulo}</h1>
                    <button id="favoriteBtn" class="text-3xl text-gray-500 hover:text-red-500 transition-colors">❤</button>
                </div>
                <div class="meta-info">
                    <span>${movie.ano}</span>
                    <span>${movie.genero}</span>
                    <span class="imdb-rating">IMDb: ${movie.avaliacao || 'N/A'}</span>
                </div>
                <p class="plot">${movie.sinopse}</p>
                
                <div class="add-to-list-widget mt-6">
                     <button id="addToListBtn" class="btn btn-primary">Adicionar à minha lista (+)</button>
                     <p class="list-feedback hidden mt-2"></p>
                </div>

                <div class="reviews-section mt-8">
                    <h3 class="text-2xl font-semibold mb-4">Avaliações dos Usuários</h3>
                    <div id="reviewsContainer"></div>
                </div>

                <div class="rating-widget mt-6">
                    <h3 class="text-lg font-semibold mb-2">Deixe sua avaliação:</h3>
                    <div class="stars" data-movie-id="${movie.id}">
                        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `<span class="star" data-value="${i}">&#9734;</span>`).join('')}
                    </div>
                    <textarea id="reviewComment" class="input mt-2" placeholder="Escreva seu comentário..."></textarea>
                    <button id="submitReviewBtn" class="btn btn-primary mt-2">Enviar Avaliação</button>
                    <p class="rating-feedback hidden mt-2"></p>
                </div>
            </div>
        `;
        addFavoriteFunctionality();
        addToListFunctionality();
        addRatingFunctionality(); // Renamed from submitReview to addRatingFunctionality
    }

    async function loadReviews() {
        const reviewsContainer = document.getElementById('reviewsContainer');
        if (!reviewsContainer) return;

        try {
            const response = await fetch(`${API_BASE_URL}/avaliacoes/series/${movieId}`);
            if (!response.ok) throw new Error('Failed to load reviews.');

            const reviews = await response.json();
            renderReviews(reviews.content, reviewsContainer);
        } catch (error) {
            console.error('Error loading reviews:', error);
            reviewsContainer.innerHTML = '<p class="text-red-500">Could not load reviews.</p>';
        }
    }

    function renderReviews(reviews, container) {
        container.innerHTML = '';
        if (reviews.length === 0) {
            container.innerHTML = '<p>Ainda não há avaliações para este filme.</p>';
            return;
        }
        reviews.forEach(review => {
            const reviewEl = document.createElement('div');
            reviewEl.className = 'review-card border-b border-border pb-4 mb-4';
            reviewEl.innerHTML = `
                <div class="flex items-center mb-2">
                    <strong class="mr-2">${review.autor}</strong>
                    <span class="text-yellow-500">${'★'.repeat(review.pontuacao)}${'☆'.repeat(10 - review.pontuacao)}</span>
                </div>
                <p>${review.comentario}</p>
                <p class="text-xs text-muted-foreground mt-1">${new Date(review.data).toLocaleDateString()}</p>
            `;
            container.appendChild(reviewEl);
        });
    }

    function addRatingFunctionality() {
        const submitBtn = document.getElementById('submitReviewBtn');
        const starsContainer = document.querySelector('.stars');
        const commentArea = document.getElementById('reviewComment');
        const feedbackP = document.querySelector('.rating-feedback');
        let currentRating = 0;

        if (!submitBtn || !starsContainer || !commentArea) return;

        starsContainer.addEventListener('click', e => {
            if (e.target.classList.contains('star')) {
                currentRating = parseInt(e.target.dataset.value);
                // Visual feedback for selected stars
                Array.from(starsContainer.children).forEach((star, index) => {
                    star.innerHTML = index < currentRating ? '★' : '☆';
                });
            }
        });

        submitBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('authToken');
            const comment = commentArea.value;

            if (!token) {
                feedbackP.textContent = 'Você precisa estar logado para avaliar.';
                feedbackP.className = 'rating-feedback mt-2 text-red-500';
                feedbackP.classList.remove('hidden');
                return;
            }
            if (currentRating === 0) {
                feedbackP.textContent = 'Por favor, selecione uma nota.';
                feedbackP.className = 'rating-feedback mt-2 text-red-500';
                feedbackP.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/avaliacoes/series/${movieId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ pontuacao: currentRating, comentario: comment })
                });

                if (!response.ok) throw new Error('Falha ao enviar avaliação.');

                feedbackP.textContent = 'Avaliação enviada com sucesso!';
                feedbackP.className = 'rating-feedback mt-2 text-green-500';
                feedbackP.classList.remove('hidden');
                commentArea.value = '';
                currentRating = 0;
                Array.from(starsContainer.children).forEach(star => star.innerHTML = '☆');
                loadReviews(); // Refresh reviews
            } catch (error) {
                console.error('Error submitting review:', error);
                feedbackP.textContent = 'Falha ao enviar avaliação. Tente novamente.';
                feedbackP.className = 'rating-feedback mt-2 text-red-500';
                feedbackP.classList.remove('hidden');
            }
        });
    }

    function addFavoriteFunctionality() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (!favoriteBtn) return;

        favoriteBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Você precisa estar logado para favoritar filmes.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/series/${movieId}/favorito`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Falha ao favoritar.');

                // Toggle button appearance
                favoriteBtn.classList.toggle('text-red-500');
                favoriteBtn.classList.toggle('text-gray-500');

            } catch (error) {
                console.error('Error favoriting:', error);
                alert('Ocorreu um erro ao favoritar o filme.');
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
                feedbackP.textContent = 'Você precisa estar logado para adicionar filmes a uma lista.';
                feedbackP.className = 'list-feedback mt-2 text-red-500';
                feedbackP.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/listas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Falha ao carregar suas listas.');
                const lists = await response.json();

                if (lists.length === 0) {
                    alert('Você não tem nenhuma lista. Crie uma primeiro na sua página de perfil.');
                    return;
                }

                showListSelectionModal(lists);

            } catch (error) {
                console.error('Error fetching lists:', error);
                feedbackP.textContent = 'Não foi possível carregar suas listas.';
                feedbackP.className = 'list-feedback mt-2 text-red-500';
                feedbackP.classList.remove('hidden');
            }
        });
    }

    function showListSelectionModal(lists) {
        // Remove existing modal if any
        const existingModal = document.getElementById('listSelectionModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'listSelectionModal';
        modal.className = 'modal';
        modal.style.display = 'block';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        modalContent.innerHTML = `
            <span class="close" id="closeListModal">&times;</span>
            <h2>Selecione uma Lista</h2>
            <select id="listSelector" class="input">
                ${lists.map(list => `<option value="${list.id}">${list.nome}</option>`).join('')}
            </select>
            <button id="confirmAddToListBtn" class="btn btn-primary mt-4">Adicionar</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        document.getElementById('closeListModal').addEventListener('click', () => modal.remove());
        document.getElementById('confirmAddToListBtn').addEventListener('click', async () => {
            const selectedListId = document.getElementById('listSelector').value;
            const token = localStorage.getItem('authToken');
            const feedbackP = document.querySelector('.list-feedback');

            try {
                const response = await fetch(`${API_BASE_URL}/listas/${selectedListId}/series/${movieId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Falha ao adicionar filme à lista.');

                feedbackP.textContent = 'Filme adicionado com sucesso!';
                feedbackP.className = 'list-feedback mt-2 text-green-500';
                feedbackP.classList.remove('hidden');
                modal.remove();

            } catch(error) {
                console.error('Error adding to list:', error);
                alert('Ocorreu um erro ao adicionar o filme à lista.');
            }
        });
    }

    loadMovieDetails();
});
