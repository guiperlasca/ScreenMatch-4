// Main Application Logic
class ScreenMatchApp {
    constructor() {
        this.currentPage = 1;
        this.currentQuery = '';
        this.currentGenre = null;
        this.isLoading = false;
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialContent();
        this.setupSearch();
        this.setupCategoryNavigation();
    }

    setupEventListeners() {
        // Hero search
        const heroSearchBtn = document.getElementById('heroSearchBtn');
        const heroSearch = document.getElementById('heroSearch');
        
        if (heroSearchBtn) {
            heroSearchBtn.addEventListener('click', () => this.performSearch());
        }
        
        if (heroSearch) {
            heroSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // Header search
        const headerSearch = document.getElementById('headerSearch');
        if (headerSearch) {
            headerSearch.addEventListener('input', (e) => this.handleHeaderSearch(e));
            headerSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreResults());
        }

        // View options
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => this.changeView(btn.dataset.view));
        });

        // Category cards
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => this.searchByGenre(card.dataset.genre));
        });

        // Explore button
        const exploreBtn = document.getElementById('exploreBtn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                document.getElementById('featuredSection')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    async loadInitialContent() {
        await Promise.all([
            this.loadFeaturedMovies(),
            this.loadPopularMovies(),
            this.loadHeroPosters()
        ]);
    }

    async loadFeaturedMovies() {
        const container = document.getElementById('featuredMovies');
        if (!container) return;

        try {
            this.showLoadingState(container);
            
            const movies = await apiService.getTrendingMovies('week');
            
            this.hideLoadingState(container);
            this.renderMoviesGrid(movies.slice(0, 12), container);
            
        } catch (error) {
            console.error('Error loading featured movies:', error);
            this.showErrorState(container, 'Erro ao carregar filmes em destaque');
        }
    }

    async loadPopularMovies() {
        const container = document.getElementById('popularMovies');
        if (!container) return;

        try {
            const movies = await apiService.getPopularMovies();
            this.renderMoviesSlider(movies.slice(0, 10), container);
            
        } catch (error) {
            console.error('Error loading popular movies:', error);
            this.showErrorState(container, 'Erro ao carregar filmes populares');
        }
    }

    async loadHeroPosters() {
        const container = document.getElementById('featuredPosters');
        if (!container) return;

        try {
            const movies = await apiService.getTrendingMovies('day');
            const selectedMovies = movies.slice(0, 3);
            
            container.innerHTML = selectedMovies.map(movie => `
                <div class="featured-poster" onclick="this.openMovieDetails(${movie.id})">
                    <img src="${movie.posterPath || 'placeholder.jpg'}" alt="${movie.title}">
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading hero posters:', error);
        }
    }

    setupSearch() {
        const headerSearch = document.getElementById('headerSearch');
        const searchDropdown = document.getElementById('searchDropdown');
        
        if (!headerSearch || !searchDropdown) return;

        headerSearch.addEventListener('focus', () => {
            if (headerSearch.value.trim()) {
                searchDropdown.style.display = 'block';
            }
        });

        document.addEventListener('click', (e) => {
            if (!headerSearch.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.style.display = 'none';
            }
        });
    }

    async handleHeaderSearch(e) {
        const query = e.target.value.trim();
        const searchDropdown = document.getElementById('searchDropdown');
        
        if (!searchDropdown) return;

        if (query.length < 2) {
            searchDropdown.style.display = 'none';
            return;
        }

        // Debounce search
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(async () => {
            try {
                const results = await apiService.searchMovies(query, 1);
                this.showSearchSuggestions(results.movies.slice(0, 5), searchDropdown);
                searchDropdown.style.display = 'block';
            } catch (error) {
                console.error('Error searching movies:', error);
                searchDropdown.style.display = 'none';
            }
        }, CONFIG.SEARCH_DEBOUNCE);
    }

    showSearchSuggestions(movies, container) {
        if (movies.length === 0) {
            container.innerHTML = '<div class="search-suggestion no-results">Nenhum resultado encontrado</div>';
            return;
        }

        container.innerHTML = movies.map(movie => `
            <div class="search-suggestion" onclick="app.openMovieDetails(${movie.id})">
                <img src="${movie.posterPath || 'placeholder.jpg'}" alt="${movie.title}">
                <div class="suggestion-info">
                    <h4>${movie.title}</h4>
                    <p>${movie.year || 'N/A'}</p>
                </div>
            </div>
        `).join('');
    }

    async performSearch(query = null) {
        const searchQuery = query || document.getElementById('heroSearch')?.value || document.getElementById('headerSearch')?.value;
        
        if (!searchQuery?.trim()) {
            authManager.showNotification('Digite algo para buscar', 'warning');
            return;
        }

        this.currentQuery = searchQuery.trim();
        this.currentPage = 1;
        this.currentGenre = null;

        try {
            this.showSearchSection();
            this.updateResultsCount('Buscando...');
            
            const results = await apiService.searchMovies(this.currentQuery, this.currentPage);
            
            this.renderSearchResults(results.movies);
            this.updateResultsCount(`${results.totalResults} resultado(s) encontrado(s)`);
            this.updateLoadMoreButton(results.currentPage < results.totalPages);
            
            // Hide search dropdown
            const searchDropdown = document.getElementById('searchDropdown');
            if (searchDropdown) {
                searchDropdown.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Error performing search:', error);
            authManager.showNotification('Erro na busca. Tente novamente.', 'error');
        }
    }

    async searchByGenre(genreName) {
        // Map genre names to TMDB IDs
        const genreMap = {
            'action': 28,
            'comedy': 35,
            'drama': 18,
            'horror': 27,
            'romance': 10749,
            'scifi': 878
        };

        const genreId = genreMap[genreName];
        if (!genreId) return;

        this.currentGenre = genreId;
        this.currentQuery = '';
        this.currentPage = 1;

        try {
            this.showSearchSection();
            this.updateResultsCount('Carregando...');
            
            const movies = await apiService.getMoviesByGenre(genreId, this.currentPage);
            
            this.renderSearchResults(movies);
            this.updateResultsCount(`Filmes de ${genreName.charAt(0).toUpperCase() + genreName.slice(1)}`);
            this.updateLoadMoreButton(true); // Assume there are more pages
            
        } catch (error) {
            console.error('Error searching by genre:', error);
            authManager.showNotification('Erro ao buscar por gênero', 'error');
        }
    }

    async loadMoreResults() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.currentPage++;

        try {
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn) {
                loadMoreBtn.textContent = 'Carregando...';
                loadMoreBtn.disabled = true;
            }

            let results;
            if (this.currentQuery) {
                results = await apiService.searchMovies(this.currentQuery, this.currentPage);
            } else if (this.currentGenre) {
                const movies = await apiService.getMoviesByGenre(this.currentGenre, this.currentPage);
                results = { movies, currentPage: this.currentPage, totalPages: 10 }; // Assume 10 pages max
            }

            if (results && results.movies.length > 0) {
                this.appendSearchResults(results.movies);
                this.updateLoadMoreButton(results.currentPage < results.totalPages);
            } else {
                this.updateLoadMoreButton(false);
            }

        } catch (error) {
            console.error('Error loading more results:', error);
            authManager.showNotification('Erro ao carregar mais resultados', 'error');
        } finally {
            this.isLoading = false;
            
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn) {
                loadMoreBtn.textContent = 'Carregar mais';
                loadMoreBtn.disabled = false;
            }
        }
    }

    setupCategoryNavigation() {
        // Add smooth scrolling to category navigation
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-4px) scale(1)';
            });
        });
    }

    showSearchSection() {
        const searchResults = document.getElementById('searchResults');
        const featuredSection = document.getElementById('featuredSection');
        
        if (searchResults) {
            searchResults.classList.remove('hidden');
            searchResults.scrollIntoView({ behavior: 'smooth' });
        }
        
        if (featuredSection) {
            featuredSection.style.display = 'none';
        }
    }

    hideSearchSection() {
        const searchResults = document.getElementById('searchResults');
        const featuredSection = document.getElementById('featuredSection');
        
        if (searchResults) {
            searchResults.classList.add('hidden');
        }
        
        if (featuredSection) {
            featuredSection.style.display = 'block';
        }
    }

    renderSearchResults(movies) {
        const container = document.getElementById('searchMoviesGrid');
        if (!container) return;

        if (movies.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum resultado encontrado</h3>
                    <p>Tente buscar com outros termos</p>
                </div>
            `;
            return;
        }

        this.renderMoviesGrid(movies, container);
    }

    appendSearchResults(movies) {
        const container = document.getElementById('searchMoviesGrid');
        if (!container || movies.length === 0) return;

        const newMovies = movies.map(movie => this.createMovieCard(movie));
        newMovies.forEach(movieElement => {
            container.appendChild(movieElement);
        });
    }

    renderMoviesGrid(movies, container) {
        if (!container) return;

        container.innerHTML = '';
        
        if (movies.length === 0) {
            this.showEmptyState(container);
            return;
        }

        movies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            container.appendChild(movieCard);
        });
    }

    renderMoviesSlider(movies, container) {
        if (!container) return;

        container.innerHTML = `
            <div class="slider-container">
                <div class="slider-track">
                    ${movies.map(movie => `
                        <div class="slider-item">
                            ${this.createMovieCard(movie).outerHTML}
                        </div>
                    `).join('')}
                </div>
                <button class="slider-btn prev" onclick="app.slideMovies('prev')">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="slider-btn next" onclick="app.slideMovies('next')">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    }

    createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-movie-id', movie.id);
        
        const rating = movie.voteAverage ? movie.voteAverage.toFixed(1) : null;
        const genres = movie.genreIds?.map(id => apiService.getGenreName(id)).slice(0, 2).join(', ') || 'N/A';
        
        card.innerHTML = `
            <div class="movie-poster" onclick="app.openMovieDetails(${movie.id})">
                <img src="${movie.posterPath || 'placeholder.jpg'}" alt="${movie.title}"
                     onerror="this.src='placeholder.jpg'">
                
                ${rating ? `
                    <div class="movie-rating">
                        <i class="fas fa-star"></i>
                        ${rating}
                    </div>
                ` : ''}
                
                <div class="movie-actions">
                    <button class="action-btn" onclick="app.toggleFavorite(${movie.id}, event)" title="Favoritar">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="app.openRatingModal(${movie.id}, event)" title="Avaliar">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="action-btn" onclick="app.addToWatchlist(${movie.id}, event)" title="Assistir depois">
                        <i class="fas fa-clock"></i>
                    </button>
                </div>
            </div>
            
            <div class="movie-info">
                <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${movie.year || 'N/A'}</span>
                    <span class="movie-genre">${genres}</span>
                </div>
            </div>
        `;
        
        return card;
    }

    async toggleFavorite(movieId, event) {
        event.stopPropagation();
        
        if (!authManager.isAuthenticated()) {
            authManager.showLoginModal();
            return;
        }

        try {
            const btn = event.target.closest('.action-btn');
            const icon = btn.querySelector('i');
            
            // Optimistic UI update
            const isFavorited = btn.classList.contains('favorited');
            btn.classList.toggle('favorited');
            icon.style.color = isFavorited ? '' : '#ef4444';
            
            await apiService.toggleFavorite(movieId);
            
            const message = isFavorited ? 'Removido dos favoritos' : 'Adicionado aos favoritos';
            authManager.showNotification(message, 'success');
            
        } catch (error) {
            console.error('Error toggling favorite:', error);
            authManager.showNotification('Erro ao favoritar filme', 'error');
            
            // Revert UI on error
            const btn = event.target.closest('.action-btn');
            btn.classList.toggle('favorited');
        }
    }

    openRatingModal(movieId, event) {
        event.stopPropagation();
        
        if (!authManager.isAuthenticated()) {
            authManager.showLoginModal();
            return;
        }

        // This would open a rating modal
        authManager.showNotification('Funcionalidade de avaliação em desenvolvimento', 'info');
    }

    addToWatchlist(movieId, event) {
        event.stopPropagation();
        
        if (!authManager.isAuthenticated()) {
            authManager.showLoginModal();
            return;
        }

        // This would add to watchlist
        authManager.showNotification('Adicionado à lista para assistir depois', 'success');
    }

    openMovieDetails(movieId) {
        window.open(`detalhes.html?id=${movieId}`, '_blank');
    }

    slideMovies(direction) {
        // Slider functionality
        authManager.showNotification('Funcionalidade de slider em desenvolvimento', 'info');
    }

    updateResultsCount(text) {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = text;
        }
    }

    updateLoadMoreButton(hasMore) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const container = document.querySelector('.load-more-container');
        
        if (container) {
            container.style.display = hasMore ? 'block' : 'none';
        }
    }

    changeView(viewType) {
        const viewBtns = document.querySelectorAll('.view-btn');
        const moviesGrid = document.getElementById('searchMoviesGrid');
        
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewType);
        });
        
        if (moviesGrid) {
            moviesGrid.className = viewType === 'list' ? 'movies-list' : 'movies-grid';
        }
    }

    showLoadingState(container) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="loading-grid">
                ${Array.from({ length: 12 }, () => '<div class="movie-card-skeleton"></div>').join('')}
            </div>
        `;
    }

    hideLoadingState(container) {
        if (!container) return;
        
        const loadingGrid = container.querySelector('.loading-grid');
        if (loadingGrid) {
            loadingGrid.remove();
        }
    }

    showErrorState(container, message) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ops! Algo deu errado</h3>
                <p>${message}</p>
                <button class="btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i>
                    Tentar novamente
                </button>
            </div>
        `;
    }

    showEmptyState(container) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-film"></i>
                <h3>Nenhum filme encontrado</h3>
                <p>Tente buscar com outros termos ou explore nossos filmes em destaque</p>
                <button class="btn-primary" onclick="app.hideSearchSection()">
                    Ver filmes em destaque
                </button>
            </div>
        `;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ScreenMatchApp();
});