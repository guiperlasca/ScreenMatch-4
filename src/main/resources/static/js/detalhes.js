// Movie Details Page Logic
class MovieDetailsPage {
    constructor() {
        this.movieId = null;
        this.movie = null;
        this.currentRating = 0;
        this.comments = [];
        this.init();
    }

    init() {
        this.getMovieIdFromUrl();
        if (this.movieId) {
            this.loadMovieDetails();
        } else {
            this.showError('ID do filme não encontrado na URL');
        }
        
        this.setupEventListeners();
    }

    getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
        this.movieId = urlParams.get('id');
    }

    setupEventListeners() {
        // Action buttons in sidebar
        const favoriteBtn = document.getElementById('favoriteBtn');
        const watchlistBtn = document.getElementById('watchlistBtn');
        const addToListBtn = document.getElementById('addToListBtn');
        const shareBtn = document.getElementById('shareBtn');

        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }
        
        if (watchlistBtn) {
            watchlistBtn.addEventListener('click', () => this.toggleWatchlist());
        }
        
        if (addToListBtn) {
            addToListBtn.addEventListener('click', () => this.showAddToListModal());
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareMovie());
        }

        // Comment system
        const addCommentBtn = document.getElementById('addCommentBtn');
        const cancelCommentBtn = document.getElementById('cancelCommentBtn');
        const submitCommentBtn = document.getElementById('submitCommentBtn');
        const commentForm = document.getElementById('commentForm');

        if (addCommentBtn) {
            addCommentBtn.addEventListener('click', () => this.showCommentForm());
        }
        
        if (cancelCommentBtn) {
            cancelCommentBtn.addEventListener('click', () => this.hideCommentForm());
        }
        
        if (submitCommentBtn) {
            submitCommentBtn.addEventListener('click', () => this.submitComment());
        }

        // Star rating for comments
        const starBtns = document.querySelectorAll('#commentRating .star-btn');
        starBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setRating(parseInt(btn.dataset.rating)));
            btn.addEventListener('mouseenter', () => this.previewRating(parseInt(btn.dataset.rating)));
        });

        const starRating = document.getElementById('commentRating');
        if (starRating) {
            starRating.addEventListener('mouseleave', () => this.resetRatingPreview());
        }

        // Header search (if present)
        const headerSearch = document.getElementById('headerSearch');
        if (headerSearch) {
            headerSearch.addEventListener('input', (e) => this.handleHeaderSearch(e));
        }
    }

    async loadMovieDetails() {
        const loadingState = document.getElementById('loadingState');
        const detailsContent = document.getElementById('movieDetailsContent');

        try {
            if (loadingState) loadingState.style.display = 'block';
            if (detailsContent) detailsContent.classList.add('hidden');

            // Load movie details from TMDB
            this.movie = await apiService.getMovieDetails(this.movieId);
            
            // Update page title
            document.title = `${this.movie.title} - ScreenMatch`;
            
            // Render movie details
            this.renderMovieHero();
            this.renderMovieInfo();
            this.renderCast();
            
            // Load comments
            await this.loadComments();
            
            if (loadingState) loadingState.style.display = 'none';
            if (detailsContent) detailsContent.classList.remove('hidden');

        } catch (error) {
            console.error('Error loading movie details:', error);
            this.showError('Erro ao carregar detalhes do filme');
        }
    }

    renderMovieHero() {
        const heroSection = document.getElementById('movieHero');
        if (!heroSection || !this.movie) return;

        const backdropUrl = this.movie.backdropPath || this.movie.posterPath;
        const genres = this.movie.genres?.map(g => g.name).join(', ') || 'N/A';
        const director = this.movie.director?.name || 'N/A';
        const runtime = apiService.formatRuntime(this.movie.runtime);

        heroSection.innerHTML = `
            <div class="hero-backdrop">
                ${backdropUrl ? `<img src="${backdropUrl}" alt="${this.movie.title}">` : ''}
            </div>
            
            <div class="hero-content">
                <div class="container">
                    <div class="hero-main">
                        <div class="hero-poster">
                            <img src="${this.movie.posterPath || 'placeholder.jpg'}" 
                                 alt="${this.movie.title}"
                                 onerror="this.src='placeholder.jpg'">
                </div>
                        
                        <div class="hero-info">
                            <h1 class="movie-title">${this.movie.title}</h1>
                            ${this.movie.tagline ? `<p class="movie-tagline">"${this.movie.tagline}"</p>` : ''}
                            
                            <div class="movie-meta">
                                ${this.movie.voteAverage ? `
                                    <div class="meta-item rating-badge">
                                        <i class="fas fa-star"></i>
                                        ${this.movie.voteAverage.toFixed(1)}
                </div>
                                ` : ''}
                                
                                <div class="meta-item">
                                    <i class="fas fa-calendar"></i>
                                    ${this.movie.year || 'N/A'}
                </div>

                                ${runtime !== 'N/A' ? `
                                    <div class="meta-item">
                                        <i class="fas fa-clock"></i>
                                        ${runtime}
                                    </div>
                                ` : ''}
                                
                                <div class="meta-item">
                                    <i class="fas fa-film"></i>
                                    ${director}
                                </div>
                </div>

                            <div class="hero-actions">
                                <button class="hero-action-btn primary" id="heroFavoriteBtn">
                                    <i class="fas fa-heart"></i>
                                    Favoritar
                                </button>
                                <button class="hero-action-btn" id="heroWatchlistBtn">
                                    <i class="fas fa-clock"></i>
                                    Assistir Depois
                                </button>
                                <button class="hero-action-btn" id="heroRateBtn">
                                    <i class="fas fa-star"></i>
                                    Avaliar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners to hero buttons
        const heroFavoriteBtn = document.getElementById('heroFavoriteBtn');
        const heroWatchlistBtn = document.getElementById('heroWatchlistBtn');
        const heroRateBtn = document.getElementById('heroRateBtn');

        if (heroFavoriteBtn) {
            heroFavoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }
        
        if (heroWatchlistBtn) {
            heroWatchlistBtn.addEventListener('click', () => this.toggleWatchlist());
        }
        
        if (heroRateBtn) {
            heroRateBtn.addEventListener('click', () => this.showCommentForm());
        }
    }

    renderMovieInfo() {
        if (!this.movie) return;

        // Overview
        const overviewElement = document.getElementById('movieOverview');
        if (overviewElement) {
            overviewElement.textContent = this.movie.overview || 'Sinopse não disponível.';
        }

        // Sidebar info
        const elements = {
            releaseDate: this.movie.releaseDate ? new Date(this.movie.releaseDate).toLocaleDateString('pt-BR') : 'N/A',
            runtime: apiService.formatRuntime(this.movie.runtime),
            genres: this.movie.genres?.map(g => g.name).join(', ') || 'N/A',
            director: this.movie.director?.name || 'N/A',
            budget: apiService.formatCurrency(this.movie.budget),
            revenue: apiService.formatCurrency(this.movie.revenue),
            voteAverage: this.movie.voteAverage ? this.movie.voteAverage.toFixed(1) : 'N/A',
            voteCount: this.movie.voteCount?.toLocaleString('pt-BR') || 'N/A',
            popularity: this.movie.popularity ? Math.round(this.movie.popularity) : 'N/A'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    renderCast() {
        const castGrid = document.getElementById('castGrid');
        const castSection = document.getElementById('castSection');
        
        if (!castGrid || !this.movie?.cast) return;

        if (this.movie.cast.length === 0) {
            castSection.style.display = 'none';
            return;
        }

        const mainCast = this.movie.cast.slice(0, 12);
        castGrid.innerHTML = mainCast.map(actor => `
            <div class="cast-member">
                <div class="cast-photo">
                    ${actor.profile_path ? `
                        <img src="${CONFIG.TMDB_IMAGE_BASE_URL}/w200${actor.profile_path}" 
                             alt="${actor.name}"
                             onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;background:var(--bg-tertiary);color:var(--text-muted);\\'>Sem foto</div>'">
                    ` : `
                        <div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--bg-tertiary);color:var(--text-muted);">
                            <i class="fas fa-user"></i>
                        </div>
                    `}
                </div>
                <div class="cast-name">${actor.name}</div>
                <div class="cast-character">${actor.character || 'N/A'}</div>
            </div>
        `).join('');
    }

    async loadComments() {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;

        try {
            // Try to load from backend first
            let comments = [];
            try {
                const backendComments = await apiService.getMovieReviews(this.movieId);
                comments = backendComments.content || backendComments || [];
            } catch (error) {
                console.log('Backend comments not available, using local storage');
            }

            // Load from local storage as well
            const localComments = this.getLocalComments();
            comments = [...comments, ...localComments];

            // Load TMDB reviews as additional context
            if (this.movie.tmdbReviews?.length > 0) {
                const tmdbComments = this.movie.tmdbReviews.map(review => ({
                    id: `tmdb_${review.id}`,
                    author: review.author,
                    content: review.content.slice(0, 500) + (review.content.length > 500 ? '...' : ''),
                    rating: Math.ceil(review.author_details?.rating / 2) || 5, // Convert 10-scale to 5-scale
                    createdAt: review.created_at,
                    source: 'TMDB'
                }));
                comments = [...comments, ...tmdbComments];
            }

            this.comments = comments;
            this.renderComments();

        } catch (error) {
            console.error('Error loading comments:', error);
            commentsList.innerHTML = '<div class="error-state"><p>Erro ao carregar comentários</p></div>';
        }
    }

    renderComments() {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;

        if (this.comments.length === 0) {
            commentsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h4>Nenhum comentário ainda</h4>
                    <p>Seja o primeiro a comentar sobre este filme!</p>
                </div>
            `;
            return;
        }

        // Sort comments by date (newest first)
        const sortedComments = [...this.comments].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.data || Date.now());
            const dateB = new Date(b.createdAt || b.data || Date.now());
            return dateB - dateA;
        });

        commentsList.innerHTML = sortedComments.map(comment => this.createCommentHTML(comment)).join('');
    }

    createCommentHTML(comment) {
        const rating = comment.rating || comment.pontuacao || 0;
        const author = comment.author || comment.autor || 'Usuário Anônimo';
        const content = comment.content || comment.comentario || '';
        const date = new Date(comment.createdAt || comment.data || Date.now());
        const isFromTMDB = comment.source === 'TMDB';

        return `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="user-avatar">
                        <img src="placeholder-user.jpg" alt="${author}">
                    </div>
                    <div class="comment-author">${author}</div>
                    ${isFromTMDB ? '<span class="comment-source">TMDB</span>' : ''}
                    <div class="comment-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(rating)}
                        ${'<i class="far fa-star"></i>'.repeat(Math.max(0, 5 - rating))}
                    </div>
                    <div class="comment-date">${date.toLocaleDateString('pt-BR')}</div>
                </div>
                <div class="comment-text">${content}</div>
                ${!isFromTMDB ? `
                    <div class="comment-actions">
                        <button class="comment-action">
                            <i class="fas fa-thumbs-up"></i>
                            Útil
                        </button>
                        <button class="comment-action">
                            <i class="fas fa-reply"></i>
                            Responder
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    showCommentForm() {
        if (!authManager.isAuthenticated()) {
            authManager.showLoginModal();
            return;
        }

        const commentForm = document.getElementById('commentForm');
        const addCommentBtn = document.getElementById('addCommentBtn');
        
        if (commentForm) {
            commentForm.classList.remove('hidden');
        }
        
        if (addCommentBtn) {
            addCommentBtn.style.display = 'none';
        }

        // Update user avatar in comment form
        const user = apiService.getCurrentUser();
        const commentUserAvatar = document.getElementById('commentUserAvatar');
        if (commentUserAvatar && user?.avatar) {
            commentUserAvatar.src = user.avatar;
        }

        // Focus on textarea
        const textarea = document.getElementById('commentText');
        if (textarea) {
            textarea.focus();
        }
    }

    hideCommentForm() {
        const commentForm = document.getElementById('commentForm');
        const addCommentBtn = document.getElementById('addCommentBtn');
        
        if (commentForm) {
            commentForm.classList.add('hidden');
        }
        
        if (addCommentBtn) {
            addCommentBtn.style.display = 'block';
        }

        // Reset form
        this.resetCommentForm();
    }

    resetCommentForm() {
        const textarea = document.getElementById('commentText');
        if (textarea) {
            textarea.value = '';
        }

        this.currentRating = 0;
        this.updateStarRating();
    }

    setRating(rating) {
        this.currentRating = rating;
        this.updateStarRating();
    }

    previewRating(rating) {
        const starBtns = document.querySelectorAll('#commentRating .star-btn');
        starBtns.forEach((btn, index) => {
            btn.classList.toggle('active', index < rating);
        });
    }

    resetRatingPreview() {
        this.updateStarRating();
    }

    updateStarRating() {
        const starBtns = document.querySelectorAll('#commentRating .star-btn');
        starBtns.forEach((btn, index) => {
            btn.classList.toggle('active', index < this.currentRating);
        });
    }

    async submitComment() {
        const textarea = document.getElementById('commentText');
        const submitBtn = document.getElementById('submitCommentBtn');
        
        if (!textarea || !submitBtn) return;

        const commentText = textarea.value.trim();
        
        if (!commentText) {
            authManager.showNotification('Digite um comentário', 'warning');
                return;
            }

        if (this.currentRating === 0) {
            authManager.showNotification('Selecione uma nota', 'warning');
                return;
            }

            try {
            authManager.setButtonLoading(submitBtn, true);

            const user = apiService.getCurrentUser();
            const newComment = {
                id: Date.now().toString(),
                author: user?.name || user?.email || 'Usuário',
                content: commentText,
                rating: this.currentRating,
                createdAt: new Date().toISOString(),
                movieId: this.movieId
            };

            // Try to save to backend
            try {
                await apiService.addReview(this.movieId, {
                    pontuacao: this.currentRating,
                    comentario: commentText
                });
            } catch (error) {
                console.log('Backend save failed, saving locally');
                this.saveLocalComment(newComment);
            }

            // Add to comments list
            this.comments.unshift(newComment);
            this.renderComments();

            // Hide form and show success
            this.hideCommentForm();
            authManager.showNotification('Comentário adicionado com sucesso!', 'success');

        } catch (error) {
            console.error('Error submitting comment:', error);
            authManager.showNotification('Erro ao adicionar comentário', 'error');
        } finally {
            authManager.setButtonLoading(submitBtn, false);
        }
    }

    saveLocalComment(comment) {
        const localComments = this.getLocalComments();
        localComments.unshift(comment);
        localStorage.setItem(`comments_${this.movieId}`, JSON.stringify(localComments));
    }

    getLocalComments() {
        try {
            return JSON.parse(localStorage.getItem(`comments_${this.movieId}`) || '[]');
        } catch {
            return [];
        }
    }

    async toggleFavorite() {
        if (!authManager.isAuthenticated()) {
            authManager.showLoginModal();
                return;
            }

            try {
            // Update UI optimistically
            const favoriteBtns = document.querySelectorAll('#favoriteBtn, #heroFavoriteBtn');
            favoriteBtns.forEach(btn => {
                btn.classList.toggle('favorited');
                btn.classList.toggle('active');
            });

            await apiService.toggleFavorite(this.movieId);
            
            const isFavorited = document.getElementById('favoriteBtn')?.classList.contains('favorited');
            const message = isFavorited ? 'Adicionado aos favoritos' : 'Removido dos favoritos';
            authManager.showNotification(message, 'success');

            } catch (error) {
            console.error('Error toggling favorite:', error);
            authManager.showNotification('Erro ao favoritar filme', 'error');
            
            // Revert UI on error
            const favoriteBtns = document.querySelectorAll('#favoriteBtn, #heroFavoriteBtn');
            favoriteBtns.forEach(btn => {
                btn.classList.toggle('favorited');
                btn.classList.toggle('active');
            });
        }
    }

    toggleWatchlist() {
        if (!authManager.isAuthenticated()) {
            authManager.showLoginModal();
                return;
            }

        // Toggle watchlist (implement in backend later)
        const watchlistBtns = document.querySelectorAll('#watchlistBtn, #heroWatchlistBtn');
        watchlistBtns.forEach(btn => {
            btn.classList.toggle('active');
        });

        authManager.showNotification('Adicionado à lista para assistir depois', 'success');
    }

    showAddToListModal() {
        if (!authManager.isAuthenticated()) {
            authManager.showLoginModal();
                    return;
                }

        authManager.showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    shareMovie() {
        if (navigator.share && this.movie) {
            navigator.share({
                title: this.movie.title,
                text: `Confira "${this.movie.title}" no ScreenMatch`,
                url: window.location.href
            });
        } else {
            // Fallback to copying URL
            navigator.clipboard.writeText(window.location.href).then(() => {
                authManager.showNotification('Link copiado para a área de transferência', 'success');
            }).catch(() => {
                authManager.showNotification('Não foi possível copiar o link', 'error');
            });
        }
    }

    async handleHeaderSearch(e) {
        const query = e.target.value.trim();
        const searchDropdown = document.getElementById('searchDropdown');
        
        if (!searchDropdown || query.length < 2) {
            if (searchDropdown) searchDropdown.style.display = 'none';
            return;
        }

        try {
            const results = await apiService.searchMovies(query, 1);
            this.showSearchSuggestions(results.movies.slice(0, 5), searchDropdown);
            searchDropdown.style.display = 'block';
        } catch (error) {
            console.error('Error searching:', error);
            searchDropdown.style.display = 'none';
        }
    }

    showSearchSuggestions(movies, container) {
        if (movies.length === 0) {
            container.innerHTML = '<div class="search-suggestion no-results">Nenhum resultado encontrado</div>';
            return;
        }

        container.innerHTML = movies.map(movie => `
            <div class="search-suggestion" onclick="window.location.href='detalhes.html?id=${movie.id}'">
                <img src="${movie.posterPath || 'placeholder.jpg'}" alt="${movie.title}">
                <div class="suggestion-info">
                    <h4>${movie.title}</h4>
                    <p>${movie.year || 'N/A'}</p>
                </div>
            </div>
        `).join('');
    }

    showError(message) {
        const loadingState = document.getElementById('loadingState');
        const detailsContent = document.getElementById('movieDetailsContent');
        
        if (loadingState) {
            loadingState.innerHTML = `
                <div class="container">
                    <div class="error-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Ops! Algo deu errado</h3>
                        <p>${message}</p>
                        <button class="btn-primary" onclick="window.location.href='index.html'">
                            <i class="fas fa-home"></i>
                            Voltar ao Início
                        </button>
                    </div>
                </div>
            `;
        }
        
        if (detailsContent) {
            detailsContent.classList.add('hidden');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.movieDetailsPage = new MovieDetailsPage();
});