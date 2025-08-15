import { api } from './api.js';
import { isUserLoggedIn, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
    loadSections();
    setupSearch();
    setupModal();
    setupCategoryFilter();
});

function updateHeader() {
    const userActions = document.getElementById('user-actions');
    if (isUserLoggedIn()) {
        userActions.innerHTML = `
            <a href="/perfil.html" class="botao botao-secundario">Perfil</a>
            <button id="logout-button" class="botao">Logout</button>
        `;
        document.getElementById('logout-button').addEventListener('click', logout);
    } else {
        userActions.innerHTML = `
            <a href="/login.html" class="botao botao-secundario">Login</a>
            <a href="/registro.html" class="botao">Registrar</a>
        `;
    }
}

async function loadSections() {
    loadSection('lancamentos', '/series/lancamentos');
    loadSection('top5', '/series/top5');
    loadSection('series', '/series');
}

async function loadSection(sectionName, endpoint) {
    const sectionElement = document.querySelector(`[data-name="${sectionName}"]`);
    if (!sectionElement) return;

    try {
        const series = await api.get(endpoint);
        renderSeriesGrid(sectionElement, series);
    } catch (error) {
        sectionElement.querySelector('.series-grid').innerHTML = '<p>Não foi possível carregar as séries. Tente novamente mais tarde.</p>';
    }
}


function renderSeriesGrid(sectionElement, series, title) {
    if (title) {
        sectionElement.querySelector('h2').textContent = title;
    }

    const gridContainer = sectionElement.querySelector('.series-grid') || sectionElement;

    if (!series || series.length === 0) {
        gridContainer.innerHTML = '<p>Nenhuma série encontrada.</p>';
        return;
    }

    const gridHTML = `
        <div class="series-grid">
            ${series.map(serie => `
                <div class="series-card">
                    <a href="/detalhes.html?id=${serie.id}">
                        <img src="${serie.poster || 'https://via.placeholder.com/200x300/2A3137/899AA8?text=Sem+Imagem'}" alt="Pôster de ${serie.titulo}">
                        <div class="card-info">
                            <h3>${serie.titulo}</h3>
                            <p>${serie.genero || 'Gênero não informado'}</p>
                        </div>
                    </a>
                </div>
            `).join('')}
        </div>
    `;

    if (gridContainer.classList.contains('series-grid')) {
        gridContainer.innerHTML = gridHTML;
    } else {
        sectionElement.innerHTML = `<h2>${title || sectionElement.querySelector('h2').textContent}</h2>` + gridHTML;
    }
}


function setupSearch() {
    const searchInput = document.getElementById('campo-pesquisa');
    const sections = document.querySelectorAll('main .section');
    const searchResultSection = document.querySelector('[data-name="categoria"]');
    let debounceTimeout;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            const query = searchInput.value;

            if (query && query.length > 2) {
                sections.forEach(s => s.classList.add('hidden'));
                searchResultSection.classList.remove('hidden');
                try {
                    const results = await api.get(`/series/buscar?titulo=${query}`);
                    renderSeriesGrid(searchResultSection, results, `Resultados para "${query}"`);
                } catch (error) {
                    searchResultSection.innerHTML = '<h2>Resultados da Busca</h2><p>Erro ao buscar séries. Tente novamente.</p>';
                }
            } else if (!query) {
                sections.forEach(s => s.classList.remove('hidden'));
                searchResultSection.classList.add('hidden');
                loadSections();
            }
        }, 300);
    });
}

function setupModal() {
    const modalContainer = document.querySelector('[data-modal-container]');
    const botaoAdicionar = document.querySelector('[data-botao-adicionar]');
    const botaoCancelar = document.querySelector('[data-botao-cancelar]');
    const formulario = document.querySelector('[data-formulario-adicionar]');

    if (botaoAdicionar) {
        botaoAdicionar.addEventListener('click', () => {
            modalContainer.classList.add('ativo');
        });
    }

    if (botaoCancelar) {
        botaoCancelar.addEventListener('click', () => {
            modalContainer.classList.remove('ativo');
        });
    }

    if (modalContainer) {
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.classList.remove('ativo');
            }
        });
    }

    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titulo = document.querySelector('[data-titulo]').value;
            const button = formulario.querySelector('button[type="submit"]');
            button.disabled = true;
            button.textContent = 'Adicionando...';
            try {
                await api.post('/series', { titulo });
                alert('Série adicionada com sucesso!');
                modalContainer.classList.remove('ativo');
                formulario.reset();
                loadSections();
            } catch (error) {
                alert('Erro ao adicionar série. Verifique se o título está correto.');
            } finally {
                button.disabled = false;
                button.textContent = 'Adicionar';
            }
        });
    }
}

function setupCategoryFilter() {
    const categorySelect = document.querySelector('[data-categorias]');
    const allSections = document.querySelectorAll('main .section');
    const categorySection = document.querySelector('[data-name="categoria"]');

    if (!categorySelect) return;

    categorySelect.addEventListener('change', async () => {
        const selected = categorySelect.value;
        allSections.forEach(s => s.classList.add('hidden'));
        categorySection.classList.remove('hidden');

        try {
            if (selected === 'todos') {
                allSections.forEach(s => s.classList.remove('hidden'));
                categorySection.classList.add('hidden');
                loadSections();
            } else if (selected === 'favoritos') {
                if (!isUserLoggedIn()) {
                    alert('Você precisa estar logado para ver seus favoritos.');
                    categorySection.innerHTML = '<h2>Meus Favoritos</h2><p>Faça login para ver suas séries favoritas.</p>';
                    return;
                }
                const favorites = await api.get('/usuarios/meus-favoritos');
                renderSeriesGrid(categorySection, favorites, 'Meus Favoritos');
            } else {
                const series = await api.get(`/series/categoria/${selected}`);
                renderSeriesGrid(categorySection, series, `Séries de ${selected.charAt(0).toUpperCase() + selected.slice(1)}`);
            }
        } catch (error) {
            categorySection.innerHTML = '<h2>Erro</h2><p>Não foi possível carregar a categoria selecionada.</p>';
        }
    });
}