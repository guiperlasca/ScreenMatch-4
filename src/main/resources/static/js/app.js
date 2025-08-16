// Configuração da API
const API_BASE_URL = 'http://localhost:8080';

// Estado da aplicação
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Elementos DOM
const featuredMoviesContainer = document.getElementById('featuredMovies');

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Verificar se o usuário está logado
    if (authToken) {
        currentUser = JSON.parse(localStorage.getItem('user'));
        updateUIForLoggedInUser();
    }
    
    // Carregar filmes em destaque
    loadFeaturedMovies();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Carregar dados para filtros
    loadFilterData();
}

function setupEventListeners() {
    // Event listeners para botões de busca
    const searchButton = document.querySelector('button:contains("Buscar")');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
    
    // Event listeners para filtros
    const filterButton = document.querySelector('button:contains("Filtros")');
    if (filterButton) {
        filterButton.addEventListener('click', handleFilters);
    }
    
    // Event listeners para avaliações
    setupRatingEventListeners();
    
    // Event listeners para listas
    setupListEventListeners();
}

// Função para carregar filmes em destaque
async function loadFeaturedMovies() {
    try {
        showLoading(featuredMoviesContainer);
        
        // Buscar séries da API
        const response = await fetch(`${API_BASE_URL}/series?size=6`);
        
        if (response.ok) {
            const data = await response.json();
            const series = data.content || [];
            renderMovies(series);
        } else {
            // Fallback para dados simulados se a API não estiver disponível
            const movies = getDefaultMovies();
            renderMovies(movies);
        }
        
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        // Fallback para dados simulados
        const movies = getDefaultMovies();
        renderMovies(movies);
    }
}

// Dados padrão para quando a API não estiver disponível
function getDefaultMovies() {
    return [
        {
            id: 1,
            titulo: 'Oppenheimer',
            ano: 2023,
            genero: 'Drama, História',
            poster: '/oppenheimer-inspired-poster.png',
            avaliacao: 4.5
        },
        {
            id: 2,
            titulo: 'Duna: Parte Dois',
            ano: 2024,
            genero: 'Ficção Científica',
            poster: '/dune-part-two-poster.png',
            avaliacao: 4.7
        },
        {
            id: 3,
            titulo: 'Parasita',
            ano: 2019,
            genero: 'Thriller, Drama',
            poster: '/parasite-movie-poster.png',
            avaliacao: 4.8
        },
        {
            id: 4,
            titulo: 'La La Land',
            ano: 2016,
            genero: 'Musical, Romance',
            poster: '/la-la-land-inspired-poster.png',
            avaliacao: 4.3
        },
        {
            id: 5,
            titulo: 'Interestelar',
            ano: 2014,
            genero: 'Ficção Científica',
            poster: '/interstellar-inspired-poster.png',
            avaliacao: 4.6
        },
        {
            id: 6,
            titulo: 'Coringa',
            ano: 2019,
            genero: 'Drama, Crime',
            poster: '/stylized-villain-poster.png',
            avaliacao: 4.2
        }
    ];
}

// Função para renderizar filmes
function renderMovies(movies) {
    featuredMoviesContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        featuredMoviesContainer.appendChild(movieCard);
    });
}

// Função para criar card de filme
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card group';
    card.innerHTML = `
        <div class="relative aspect-[3/4] overflow-hidden">
            <img src="${movie.poster}" alt="${movie.titulo}" class="movie-poster">
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div class="flex gap-2">
                    <button class="play-btn" data-movie-id="${movie.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play h-4 w-4">
                            <polygon points="6 3 20 12 6 21 6 3"></polygon>
                        </svg>
                    </button>
                    <button class="favorite-btn" data-movie-id="${movie.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart h-4 w-4">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                        </svg>
                    </button>
                    <button class="add-list-btn" data-movie-id="${movie.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus h-4 w-4">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-3 w-3 fill-yellow-400 text-yellow-400 mr-1">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                ${movie.avaliacao || 'N/A'}
            </div>
        </div>
        <div class="p-4">
            <h3 class="movie-title">${movie.titulo}</h3>
            <p class="movie-year">${movie.ano || 'Ano não informado'}</p>
            <p class="movie-genre">${movie.genero || 'Gênero não informado'}</p>
            <div class="mt-3 flex gap-2">
                <button class="rate-btn text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" data-movie-id="${movie.id}">
                    Avaliar
                </button>
                <button class="add-to-list-btn text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" data-movie-id="${movie.id}">
                    Adicionar à Lista
                </button>
            </div>
        </div>
    `;
    
    // Adicionar event listeners aos botões
    setupMovieCardEvents(card, movie);
    
    return card;
}

// Configurar eventos dos cards de filme
function setupMovieCardEvents(card, movie) {
    const playBtn = card.querySelector('.play-btn');
    const favoriteBtn = card.querySelector('.favorite-btn');
    const addListBtn = card.querySelector('.add-list-btn');
    const rateBtn = card.querySelector('.rate-btn');
    const addToListBtn = card.querySelector('.add-to-list-btn');
    
    if (playBtn) {
        playBtn.addEventListener('click', () => handlePlayMovie(movie));
    }
    
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => handleFavoriteMovie(movie));
    }
    
    if (addListBtn) {
        addListBtn.addEventListener('click', () => handleAddToList(movie));
    }
    
    if (rateBtn) {
        rateBtn.addEventListener('click', () => handleRateMovie(movie));
    }
    
    if (addToListBtn) {
        addToListBtn.addEventListener('click', () => handleAddToCustomList(movie));
    }
}

// Handlers para ações dos filmes
function handlePlayMovie(movie) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    // Implementar lógica para reproduzir filme
    console.log('Reproduzindo filme:', movie.titulo);
    alert(`Reproduzindo ${movie.titulo}`);
}

function handleFavoriteMovie(movie) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    // Implementar lógica para favoritar filme
    console.log('Favoritando filme:', movie.titulo);
    alert(`${movie.titulo} adicionado aos favoritos!`);
}

function handleAddToList(movie) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    // Implementar lógica para adicionar à lista
    console.log('Adicionando filme à lista:', movie.titulo);
    alert(`${movie.titulo} adicionado à lista!`);
}

function handleRateMovie(movie) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    showRatingModal(movie);
}

function handleAddToCustomList(movie) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    showCustomListModal(movie);
}

// Função de busca avançada
async function handleSearch() {
    const searchInputs = document.querySelectorAll('input[placeholder*="filme"], input[placeholder*="Diretor"], input[placeholder*="Ano"], input[placeholder*="Gênero"], input[placeholder*="Ator"]');
    const searchData = {};
    
    searchInputs.forEach(input => {
        if (input.value.trim()) {
            const placeholder = input.placeholder.toLowerCase();
            if (placeholder.includes('filme')) searchData.titulo = input.value.trim();
            else if (placeholder.includes('diretor')) searchData.diretor = input.value.trim();
            else if (placeholder.includes('ano')) searchData.ano = input.value.trim();
            else if (placeholder.includes('gênero')) searchData.genero = input.value.trim();
            else if (placeholder.includes('ator')) searchData.ator = input.value.trim();
        }
    });
    
    if (Object.keys(searchData).length === 0) {
        alert('Por favor, preencha pelo menos um campo de busca.');
        return;
    }
    
    // Executar busca na API
    await performAdvancedSearch(searchData);
}

// Função para executar busca avançada
async function performAdvancedSearch(searchCriteria) {
    try {
        showLoading(featuredMoviesContainer);
        
        // Construir query string
        const params = new URLSearchParams();
        Object.entries(searchCriteria).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        
        const response = await fetch(`${API_BASE_URL}/busca/series?${params.toString()}`);
        
        if (response.ok) {
            const data = await response.json();
            const series = data.content || [];
            
            if (series.length === 0) {
                showError(featuredMoviesContainer, 'Nenhuma série encontrada com os critérios especificados.');
            } else {
                renderMovies(series);
                showSuccessMessage(`Encontradas ${series.length} séries!`);
            }
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
        
    } catch (error) {
        console.error('Erro na busca:', error);
        showError(featuredMoviesContainer, 'Erro ao realizar busca. Tente novamente.');
    }
}

// Função para filtros
function handleFilters() {
    showAdvancedFiltersModal();
}

// Função para carregar dados dos filtros
async function loadFilterData() {
    try {
        // Carregar gêneros
        const generosResponse = await fetch(`${API_BASE_URL}/busca/series/generos`);
        if (generosResponse.ok) {
            const generos = await generosResponse.json();
            populateGenreFilter(generos);
        }
        
        // Carregar anos
        const anosResponse = await fetch(`${API_BASE_URL}/busca/series/anos`);
        if (anosResponse.ok) {
            const anos = await anosResponse.json();
            populateYearFilter(anos);
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados dos filtros:', error);
    }
}

// Função para popular filtro de gêneros
function populateGenreFilter(generos) {
    const generoInput = document.querySelector('input[placeholder*="Gênero"]');
    if (generoInput && generos.length > 0) {
        // Criar datalist para sugestões
        const datalist = document.createElement('datalist');
        datalist.id = 'generos-sugestoes';
        
        generos.forEach(genero => {
            const option = document.createElement('option');
            option.value = genero;
            datalist.appendChild(option);
        });
        
        generoInput.setAttribute('list', 'generos-sugestoes');
        document.body.appendChild(datalist);
    }
}

// Função para popular filtro de anos
function populateYearFilter(anos) {
    const anoInput = document.querySelector('input[placeholder*="Ano"]');
    if (anoInput && anos.length > 0) {
        // Criar datalist para sugestões
        const datalist = document.createElement('datalist');
        datalist.id = 'anos-sugestoes';
        
        anos.forEach(ano => {
            const option = document.createElement('option');
            option.value = ano;
            datalist.appendChild(option);
        });
        
        anoInput.setAttribute('list', 'anos-sugestoes');
        document.body.appendChild(datalist);
    }
}

// Configurar eventos de avaliação
function setupRatingEventListeners() {
    // Será implementado quando criarmos o modal de avaliação
}

// Configurar eventos de listas
function setupListEventListeners() {
    // Será implementado quando criarmos o modal de listas
}

// Funções de utilidade
function showLoading(container) {
    container.innerHTML = '<div class="loading-spinner mx-auto"></div>';
}

function showError(container, message) {
    container.innerHTML = `<div class="error-message">${message}</div>`;
}

function showSuccessMessage(message) {
    // Criar elemento de mensagem de sucesso
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Adicionar ao body
    document.body.appendChild(successDiv);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

function updateUIForLoggedInUser() {
    // Atualizar interface para usuário logado
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) loginBtn.textContent = currentUser.login;
    if (registerBtn) registerBtn.textContent = 'Sair';
    
    // Adicionar event listener para logout
    if (registerBtn) {
        registerBtn.addEventListener('click', logout);
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    currentUser = null;
    authToken = null;
    
    // Recarregar página ou atualizar UI
    location.reload();
}

// Função para mostrar modal de login
function showLoginModal() {
    // Esta função será implementada no auth.js
    if (window.showLoginModal) {
        window.showLoginModal();
    }
}

// Função para mostrar modal de avaliação
function showRatingModal(movie) {
    // Será implementada quando criarmos o modal de avaliação
    alert(`Modal de avaliação para ${movie.titulo} será implementado!`);
}

// Função para mostrar modal de lista personalizada
function showCustomListModal(movie) {
    // Será implementada quando criarmos o modal de lista
    alert(`Modal de lista personalizada para ${movie.titulo} será implementado!`);
}

// Função para mostrar modal de filtros avançados
function showAdvancedFiltersModal() {
    // Será implementada quando criarmos o modal de filtros
    alert('Modal de filtros avançados será implementado!');
}

// Exportar funções para uso global
window.app = {
    loadFeaturedMovies,
    handleSearch,
    handleFilters,
    logout,
    currentUser: () => currentUser,
    authToken: () => authToken,
    performAdvancedSearch,
    showRatingModal,
    showCustomListModal,
    showAdvancedFiltersModal
};