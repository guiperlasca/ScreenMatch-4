document.addEventListener('DOMContentLoaded', () => {
    const featuredMoviesContainer = document.getElementById('featuredMovies');

    const API_BASE_URL = 'http://localhost:8080';

    async function loadFeaturedMovies() {
        // Using fallback movies directly because the backend is not working.
        setTimeout(() => {
            renderMovies(getFallbackMovies());
        }, 500);
    }

    function renderMovies(movies) {
        if (!featuredMoviesContainer) return;
        featuredMoviesContainer.innerHTML = '';
        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            featuredMoviesContainer.appendChild(movieCard);
        });
    }

    function createMovieCard(movie) {
        const card = document.createElement('a');
        card.className = 'movie-card';
        card.href = `detalhes.html?id=${movie.id}`;
        card.innerHTML = `
            <img src="${movie.poster || '/img/placeholder.jpg'}" alt="${movie.titulo}" class="movie-poster">
            <div class="p-4">
                <h3 class="movie-title">${movie.titulo}</h3>
                <p class="movie-year">${movie.ano || 'N/A'}</p>
                <p class="movie-genre">${movie.genero || 'N/A'}</p>
            </div>
        `;
        return card;
    }

    function getFallbackMovies() {
        return [
            { id: 1, titulo: 'Oppenheimer', ano: 2023, genero: 'Drama, História', poster: 'img/oppenheimer-inspired-poster.png', sinopse: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.' },
            { id: 2, titulo: 'Duna: Parte Dois', ano: 2024, genero: 'Ficção Científica', poster: 'img/dune-part-two-poster.png', sinopse: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.' },
            { id: 3, titulo: 'Parasita', ano: 2019, genero: 'Thriller, Drama', poster: 'img/parasite-movie-poster.png', sinopse: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.' },
            { id: 4, titulo: 'La La Land', ano: 2016, genero: 'Musical, Romance', poster: 'img/la-la-land-inspired-poster.png', sinopse: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.' },
            { id: 5, titulo: 'Interestelar', ano: 2014, genero: 'Ficção Científica', poster: 'img/interstellar-inspired-poster.png', sinopse: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.' },
            { id: 6, titulo: 'Coringa', ano: 2019, genero: 'Drama, Crime', poster: 'img/stylized-villain-poster.png', sinopse: 'A mentally troubled comedian embarking on a downward spiral of social revolution and bloody crime in Gotham City.' },
        ];
    }

    loadFeaturedMovies();

    const searchButton = document.querySelector('button.btn-primary.flex-1');
    if (searchButton && searchButton.textContent === 'Buscar') {
        searchButton.addEventListener('click', handleSearch);
    }

    async function handleSearch() {
        alert("Search is disabled because the backend is not available.");
    }
});
