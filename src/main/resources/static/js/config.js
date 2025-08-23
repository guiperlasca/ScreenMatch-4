// Configurações da aplicação
const CONFIG = {
    // API Backend
    API_BASE_URL: 'http://localhost:8080',
    
    // API Externa de Filmes (TMDB - The Movie Database)
    TMDB_API_KEY: '4e44d9029b1270a757cddc766a1bcb63', // API Key pública de exemplo
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    
    // Configurações de imagem
    POSTER_SIZES: {
        small: 'w200',
        medium: 'w300',
        large: 'w500',
        xlarge: 'w780',
        original: 'original'
    },
    
    BACKDROP_SIZES: {
        small: 'w300',
        medium: 'w780',
        large: 'w1280',
        original: 'original'
    },
    
    // Configurações de paginação
    ITEMS_PER_PAGE: 20,
    
    // Configurações de cache
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
    
    // Configurações de debounce
    SEARCH_DEBOUNCE: 500, // 500ms
};
