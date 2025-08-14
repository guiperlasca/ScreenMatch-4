import { api } from './api.js';
import { isUserLoggedIn, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
    loadLatestSeries();
    setupSearch();
});

function updateHeader() {
    const userArea = document.getElementById('user-area');
    if (isUserLoggedIn()) {
        userArea.innerHTML = `
            <a href="/perfil.html" class="btn btn-secondary">Perfil</a>
            <button id="logout-button" class="btn btn-primary">Logout</button>
        `;
        document.getElementById('logout-button').addEventListener('click', logout);
    } else {
        userArea.innerHTML = `
            <a href="/login.html" class="btn btn-secondary">Login</a>
            <a href="/registro.html" class="btn btn-primary">Registrar</a>
        `;
    }
}

async function loadLatestSeries() {
    const grid = document.getElementById('series-grid');
    if (!grid) return;

    try {
        const series = await api.get('/series/lancamentos');
        renderSeriesGrid(grid, series);
    } catch (error) {
        grid.innerHTML = '<p>Não foi possível carregar as séries. Tente novamente mais tarde.</p>';
    }
}

function renderSeriesGrid(gridElement, series) {
    if (!series || series.length === 0) {
        gridElement.innerHTML = '<p>Nenhuma série encontrada.</p>';
        return;
    }

    gridElement.innerHTML = series.map(serie => `
        <div class="series-card">
            <a href="/detalhes.html?id=${serie.id}">
                <img src="${serie.poster}" alt="Pôster de ${serie.titulo}">
            </a>
        </div>
    `).join('');
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const seriesSection = document.getElementById('series-section');
    const grid = document.getElementById('series-grid');
    let debounceTimeout;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            const query = searchInput.value;
            if (query && query.length > 2) {
                seriesSection.querySelector('h2').textContent = `Resultados para "${query}"`;
                try {
                    const results = await api.get(`/series/buscar?titulo=${query}`);
                    renderSeriesGrid(grid, results);
                } catch (error) {
                    grid.innerHTML = '<p>Erro ao buscar séries. Tente novamente.</p>';
                }
            } else if (!query) {
                seriesSection.querySelector('h2').textContent = 'Lançamentos';
                loadLatestSeries();
            }
        }, 300);
    });
}
