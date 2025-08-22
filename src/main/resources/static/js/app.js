document.addEventListener('DOMContentLoaded', () => {
    const featuredMoviesContainer = document.getElementById('featuredMovies');

    async function loadFeaturedMovies() {
        try {
            const response = await fetch(`${API_BASE_URL}/series/top5`);
            if (!response.ok) {
                throw new Error('Failed to load featured movies.');
            }
            const movies = await response.json();
            renderMovies(movies, featuredMoviesContainer);
        } catch (error) {
            console.error('Error loading featured movies:', error);
            if (featuredMoviesContainer) {
                featuredMoviesContainer.innerHTML = '<p class="text-red-500">Could not load featured movies.</p>';
            }
        }
    }

    function renderMovies(movies, container) {
        if (!container) return;
        container.innerHTML = '';
        if (movies.length === 0) {
            container.innerHTML = '<p>No movies found.</p>';
            return;
        }
        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            if (movieCard) {
                container.appendChild(movieCard);
            }
        });
    }

    function createMovieCard(movie) {
        if (!movie.id) {
            console.warn('Skipping movie card creation because movie.id is missing', movie);
            return null;
        }
        const card = document.createElement('a');
        card.className = 'movie-card block border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300';
        card.href = `detalhes.html?id=${movie.id}`;
        card.innerHTML = `
            <img src="${movie.poster || 'img/placeholder.jpg'}" alt="${movie.titulo}" class="w-full h-auto object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg text-foreground">${movie.titulo}</h3>
                <p class="text-sm text-muted-foreground">${movie.ano || 'N/A'}</p>
                <p class="text-sm text-muted-foreground">${movie.genero || 'N/A'}</p>
            </div>
        `;
        return card;
    }

    loadFeaturedMovies();

    const searchButton = document.querySelector('button.btn-primary.flex-1');
    const searchInput = document.querySelector('input[placeholder="Título do filme"]');
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6';

    const featuredMoviesSection = document.getElementById('featuredMovies').parentElement;

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    async function handleSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            // If search is cleared, show featured movies again
            searchResultsContainer.remove();
            document.getElementById('featuredMovies').style.display = 'grid';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/series/buscar?titulo=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Search failed.');
            }
            const movies = await response.json();

            // Hide featured movies and show search results
            document.getElementById('featuredMovies').style.display = 'none';
            featuredMoviesSection.appendChild(searchResultsContainer);
            renderMovies(movies, searchResultsContainer);

        } catch (error) {
            console.error('Error during search:', error);
            searchResultsContainer.innerHTML = '<p class="text-red-500">Search failed. Please try again later.</p>';
        }
    }
});
