import getDados from "./getDados.js";
import postDados from "./postDados.js";
import patchDados from "./patchDados.js";
import { isUserLoggedIn, logout } from './auth.js';

const main = document.querySelector('main');

main.addEventListener('click', async (evento) => {
    if (evento.target.classList.contains('favorito')) {
        if (!isUserLoggedIn()) {
            alert('Você precisa estar logado para favoritar uma série.');
            window.location.href = '/login.html';
            return;
        }

        const starElement = evento.target;
        const serieId = parseInt(starElement.dataset.id, 10);

        const isFavorited = userFavorites.has(serieId);

        // Optimistic UI update
        if (isFavorited) {
            userFavorites.delete(serieId);
            starElement.textContent = 'star_outline';
        } else {
            userFavorites.add(serieId);
            starElement.textContent = 'star';
        }

        try {
            await patchDados(`/series/${serieId}/favorito`);
        } catch (error) {
            console.error('Erro ao favoritar série:', error);
            // Revert UI on error
            if (isFavorited) {
                userFavorites.add(serieId);
                starElement.textContent = 'star';
            } else {
                userFavorites.delete(serieId);
                starElement.textContent = 'star_outline';
            }
            alert('Não foi possível atualizar o status de favorito. Tente novamente.');
        }
    }
});

const modalContainer = document.querySelector('[data-modal-container]');
const botaoAdicionar = document.querySelector('[data-botao-adicionar]');
const botaoCancelar = document.querySelector('[data-botao-cancelar]');
const formularioAdicionar = document.querySelector('[data-formulario-adicionar]');

botaoAdicionar.addEventListener('click', () => {
    modalContainer.classList.add('mostrar');
});

botaoCancelar.addEventListener('click', () => {
    modalContainer.classList.remove('mostrar');
});

modalContainer.addEventListener('click', (evento) => {
    if (evento.target === modalContainer) {
        modalContainer.classList.remove('mostrar');
    }
});

formularioAdicionar.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const titulo = document.querySelector('[data-titulo]').value;
    try {
        await postDados('/series', { titulo });
        modalContainer.classList.remove('mostrar');
        // Limpa o formulário
        formularioAdicionar.reset();
        // Atualiza a lista de séries
        geraSeries();
    } catch (error) {
        console.error('Erro ao adicionar série:', error);
    }
});


// Mapeia os elementos DOM que você deseja atualizar
const elementos = {
    top5: document.querySelector('[data-name="top5"]'),
    lancamentos: document.querySelector('[data-name="lancamentos"]'),
    series: document.querySelector('[data-name="series"]'),
    favoritos: document.querySelector('[data-name="favoritos"]')
};

// Função para criar a lista de filmes

// Função para criar a lista de filmes
function criarListaFilmes(elemento, dados) {
    // Verifique se há um elemento <ul> dentro da seção
    const ulExistente = elemento.querySelector('ul');

    // Se um elemento <ul> já existe dentro da seção, remova-o
    if (ulExistente) {
        elemento.removeChild(ulExistente);
    }

    const ul = document.createElement('ul');
    ul.className = 'lista';
    const listaHTML = dados.map((filme) => {
        const isFavorite = userFavorites.has(filme.id);
        const starIcon = isFavorite ? 'star' : 'star_outline';
        return `
            <li class="lista__item">
                <a href="/detalhes.html?id=${filme.id}">
                    <img src="${filme.poster}" alt="${filme.titulo}">
                </a>
                <span class="material-symbols-outlined favorito" data-id="${filme.id}">
                    ${starIcon}
                </span>
            </li>
        `;
    }).join('');

    ul.innerHTML = listaHTML;
    elemento.appendChild(ul);
}

// Função genérica para tratamento de erros
function lidarComErro(mensagemErro) {
    console.error(mensagemErro);
}

const categoriaSelect = document.querySelector('[data-categorias]');
const sectionsParaOcultar = document.querySelectorAll('.section'); // Adicione a classe CSS 'hide-when-filtered' às seções e títulos que deseja ocultar.

categoriaSelect.addEventListener('change', function () {
    const categoria = document.querySelector('[data-name="categoria"]');
    const categoriaSelecionada = categoriaSelect.value;

    if (categoriaSelecionada === 'todos') {

        for (const section of sectionsParaOcultar) {
            section.classList.remove('hidden')
        }
        categoria.classList.add('hidden');

    } else {

        for (const section of sectionsParaOcultar) {
            section.classList.add('hidden')
        }

        categoria.classList.remove('hidden')
        // Faça uma solicitação para o endpoint com a categoria selecionada
        if (categoriaSelecionada === 'favoritos') {
            const favoritos = document.querySelector('[data-name="favoritos"]');
            for (const section of sectionsParaOcultar) {
                section.classList.add('hidden')
            }
            favoritos.classList.remove('hidden');
            getDados(`/usuarios/meus-favoritos`)
                .then(data => {
                    criarListaFilmes(favoritos, data);
                })
                .catch(error => {
                    lidarComErro("Ocorreu um erro ao carregar os dados da categoria.");
                });
        } else {
            getDados(`/series/categoria/${categoriaSelecionada}`)
                .then(data => {
                    criarListaFilmes(categoria, data);
                })
                .catch(error => {
                    lidarComErro("Ocorreu um erro ao carregar os dados da categoria.");
                });
        }
    }
});

// --- Lógica de Pesquisa ---
const campoPesquisa = document.getElementById('campo-pesquisa');
let debounceTimeout;

campoPesquisa.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const query = campoPesquisa.value;
        if (query && query.length > 2) {
            buscarEExibirSeries(query);
        } else if (!query) {
            // Se o campo de busca estiver vazio, volta a exibir as listas padrão
            mostrarSessoesPadrao();
            geraSeries();
        }
    }, 500); // 500ms de delay
});

function buscarEExibirSeries(query) {
    const categoria = document.querySelector('[data-name="categoria"]');
    for (const section of sectionsParaOcultar) {
        section.classList.add('hidden');
    }
    categoria.classList.remove('hidden');
    getDados(`/series/buscar?titulo=${query}`)
        .then(data => {
            criarListaFilmes(categoria, data);
        })
        .catch(error => {
            lidarComErro("Ocorreu um erro ao buscar as séries.");
        });
}

function mostrarSessoesPadrao() {
    const categoria = document.querySelector('[data-name="categoria"]');
    for (const section of sectionsParaOcultar) {
        section.classList.remove('hidden');
    }
    categoria.classList.add('hidden');
}


let userFavorites = new Set();

document.addEventListener('DOMContentLoaded', () => {
    if (isUserLoggedIn()) {
        const userActions = document.getElementById('user-actions');
        userActions.innerHTML = `
            <a href="/perfil.html" class="botao">Perfil</a>
            <button id="logout-button" class="botao botao-secundario">Logout</button>
        `;
        document.getElementById('logout-button').addEventListener('click', logout);

        getDados('/usuarios/meus-favoritos')
            .then(data => {
                userFavorites = new Set(data.map(serie => serie.id));
                geraSeries(); // Gera as séries depois de saber quais são as favoritas
            });
    } else {
        geraSeries(); // Gera as séries para o usuário não logado
    }
});


// Array de URLs para as solicitações
function geraSeries() {
    const urls = ['/series/top5', '/series/lancamentos', '/series'];

    // Faz todas as solicitações em paralelo
    Promise.all(urls.map(url => getDados(url)))
        .then(data => {
            criarListaFilmes(elementos.top5, data[0]);
            criarListaFilmes(elementos.lancamentos, data[1]);
            criarListaFilmes(elementos.series, data[2].slice(0, 5));
        })
        .catch(error => {
            lidarComErro("Ocorreu um erro ao carregar os dados.");
        });

}
