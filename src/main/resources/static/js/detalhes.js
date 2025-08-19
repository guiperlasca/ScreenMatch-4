document.addEventListener('DOMContentLoaded', () => {
    const movieDetailsContainer = document.getElementById('movieDetails');

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = parseInt(urlParams.get('id'));

    if (!movieId) {
        movieDetailsContainer.innerHTML = '<p>Movie ID not found.</p>';
        return;
    }

    function getFallbackMovies() {
        return [
            { id: 1, titulo: 'Oppenheimer', ano: 2023, genero: 'Drama, História', poster: '/img/oppenheimer-inspired-poster.png', sinopse: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', avaliacao: 8.6 },
            { id: 2, titulo: 'Duna: Parte Dois', ano: 2024, genero: 'Ficção Científica', poster: '/img/dune-part-two-poster.png', sinopse: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', avaliacao: 8.9 },
            { id: 3, titulo: 'Parasita', ano: 2019, genero: 'Thriller, Drama', poster: '/img/parasite-movie-poster.png', sinopse: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', avaliacao: 8.5 },
            { id: 4, titulo: 'La La Land', ano: 2016, genero: 'Musical, Romance', poster: '/img/la-la-land-inspired-poster.png', sinopse: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.', avaliacao: 8.0 },
            { id: 5, titulo: 'Interestelar', ano: 2014, genero: 'Ficção Científica', poster: '/img/interstellar-inspired-poster.png', sinopse: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', avaliacao: 8.7 },
            { id: 6, titulo: 'Coringa', ano: 2019, genero: 'Drama, Crime', poster: '/img/stylized-villain-poster.png', sinopse: 'A mentally troubled comedian embarking on a downward spiral of social revolution and bloody crime in Gotham City.', avaliacao: 8.4 },
        ];
    }

    const movie = getFallbackMovies().find(m => m.id === movieId);

    if (!movie) {
        movieDetailsContainer.innerHTML = '<p>Movie not found.</p>';
        return;
    }

    function renderMovieDetails(movie) {
        movieDetailsContainer.innerHTML = `
            <div class="poster">
                <img src="${movie.poster || '/img/placeholder.jpg'}" alt="${movie.titulo}">
            </div>
            <div class="info">
                <h1>${movie.titulo}</h1>
                <div class="meta">
                    <span>${movie.ano}</span>
                    <span>${movie.genero}</span>
                    <span>IMDb: ${movie.avaliacao}</span>
                </div>
                <p class="plot">${movie.sinopse}</p>
                
                <div class="rating-widget">
                    <h3>Avalie este filme:</h3>
                    <div class="stars" data-movie-id="${movie.id}">
                        ${[1, 2, 3, 4, 5].map(i => `<span data-value="${i}">&#9734;</span>`).join('')}
                    </div>
                </div>

                <div class="add-to-list-widget">
                     <button id="addToListBtn" class="btn btn-primary">Adicionar à minha lista</button>
                </div>
            </div>
        `;
        addRatingFunctionality();
        addToListFunctionality();
    }

    function addRatingFunctionality() {
        const starsContainer = document.querySelector('.stars');
        if (!starsContainer) return;

        starsContainer.addEventListener('click', () => {
            alert('Rating is disabled because the backend is not available.');
        });
    }

    function addToListFunctionality() {
        const addToListBtn = document.getElementById('addToListBtn');
        if(addToListBtn) {
            addToListBtn.addEventListener('click', () => {
                alert('Add to list functionality is disabled because the backend is not available.');
            });
        }
    }

    renderMovieDetails(movie);
});
