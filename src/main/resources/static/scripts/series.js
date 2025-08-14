import getDados from "./getDados.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('temporadas-episodios');
const fichaDescricao = document.getElementById('ficha-descricao');

// Função para carregar temporadas
function carregarTemporadas() {
    getDados(`/series/${serieId}/temporadas/todas`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            listaTemporadas.innerHTML = ''; // Limpa as opções existentes

            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecione a temporada'
            listaTemporadas.appendChild(optionDefault); 
           
            temporadasUnicas.forEach(temporada => {
                const option = document.createElement('option');
                option.value = temporada;
                option.textContent = temporada;
                listaTemporadas.appendChild(option);
            });

            const optionTodos = document.createElement('option');
            optionTodos.value = 'todas';
            optionTodos.textContent = 'Todas as temporadas'
            listaTemporadas.appendChild(optionTodos); 
        })
        .catch(error => {
            console.error('Erro ao obter temporadas:', error);
        });
}

// Função para carregar episódios de uma temporada
function carregarEpisodios() {
    getDados(`/series/${serieId}/temporadas/${listaTemporadas.value}`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            fichaSerie.innerHTML = ''; 
            temporadasUnicas.forEach(temporada => {
                const ul = document.createElement('ul');
                ul.className = 'episodios-lista';

                const episodiosTemporadaAtual = data.filter(serie => serie.temporada === temporada);

                const listaHTML = episodiosTemporadaAtual.map(serie => `
                    <li>
                        ${serie.numeroEpisodio} - ${serie.titulo}
                    </li>
                `).join('');
                ul.innerHTML = listaHTML;
                
                const paragrafo = document.createElement('p');
                const linha = document.createElement('br');
                paragrafo.textContent = `Temporada ${temporada}`;
                fichaSerie.appendChild(paragrafo);
                fichaSerie.appendChild(linha);
                fichaSerie.appendChild(ul);
            });
        })
        .catch(error => {
            console.error('Erro ao obter episódios:', error);
        });
}

// Função para carregar informações da série
function carregarInfoSerie() {
    const detalhesContainer = document.getElementById('detalhes-container');
    getDados(`/series/${serieId}`)
        .then(data => {
            const anoLancamento = "2023"; // Placeholder, idealmente viria do backend
            detalhesContainer.innerHTML = `
                <div class="detalhes__poster">
                    <img src="${data.poster}" alt="Pôster da série ${data.titulo}">
                </div>
                <div class="detalhes__info">
                    <h2>${data.titulo}</h2>
                    <div class="detalhes__metadata">
                        <span>${data.genero}</span>
                    </div>
                    <div class="detalhes__avaliacao">
                        <span class="material-symbols-outlined">star</span>
                        <span>${data.avaliacao} / 10</span>
                    </div>
                    <p class="detalhes__sinopse">${data.sinopse}</p>
                    <div class="detalhes__elenco">
                        <h4>Elenco Principal</h4>
                        <p>${data.atores}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Erro ao obter informações da série:', error);
            detalhesContainer.innerHTML = '<p>Não foi possível carregar os detalhes da série.</p>';
        });
}

// Adiciona ouvinte de evento para o elemento select
listaTemporadas.addEventListener('change', carregarEpisodios);

// Carrega as informações da série e as temporadas quando a página carrega
carregarInfoSerie();
carregarTemporadas();


// --- Lógica de Reviews ---

const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');
const stars = document.querySelectorAll('.star-rating .material-symbols-outlined');
const avaliacaoInput = document.getElementById('avaliacao-input');

// Lógica para o sistema de avaliação por estrelas
stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        resetStars();
        const value = parseInt(star.dataset.value);
        for (let i = 0; i < value; i++) {
            stars[i].classList.add('active');
        }
    });

    star.addEventListener('mouseout', () => {
        resetStars();
        const currentValue = parseInt(avaliacaoInput.value);
        if (currentValue > 0) {
            for (let i = 0; i < currentValue; i++) {
                stars[i].classList.add('active');
            }
        }
    });

    star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value);
        avaliacaoInput.value = value;
    });
});

function resetStars() {
    stars.forEach(s => s.classList.remove('active'));
}

// Lógica para carregar as reviews existentes
function carregarReviews() {
    getDados(`/series/${serieId}/reviews`)
        .then(data => {
            reviewsList.innerHTML = ''; // Limpa a lista
            if (data.length === 0) {
                reviewsList.innerHTML = '<p>Ainda não há reviews para esta série. Seja o primeiro!</p>';
                return;
            }
            data.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('review');

                let ratingStars = '';
                for (let i = 1; i <= 5; i++) {
                    const isFilled = i <= review.avaliacao ? 'filled' : '';
                    ratingStars += `<span class="material-symbols-outlined ${isFilled}">star</span>`;
                }

                reviewElement.innerHTML = `
                    <div class="review__header">
                        <div class="review__rating">
                           ${ratingStars}
                        </div>
                        <span class="review__date">${new Date(review.data).toLocaleDateString()}</span>
                    </div>
                    <p class="review__texto">${review.texto}</p>
                `;
                reviewsList.appendChild(reviewElement);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar reviews:', error);
            reviewsList.innerHTML = '<p>Não foi possível carregar as reviews.</p>';
        });
}

// Lógica para submeter uma nova review
reviewForm.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const texto = document.getElementById('texto-review').value;
    const avaliacao = parseInt(avaliacaoInput.value);

    if (avaliacao === 0) {
        alert('Por favor, selecione uma avaliação de 1 a 5 estrelas.');
        return;
    }

    const reviewData = { texto, avaliacao };

    fetch(`/series/${serieId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao enviar review');
        }
        return response.json();
    })
    .then(() => {
        // Limpar o formulário e recarregar as reviews
        reviewForm.reset();
        resetStars();
        avaliacaoInput.value = 0;
        carregarReviews();
    })
    .catch(error => {
        console.error('Erro ao criar review:', error);
        alert('Ocorreu um erro ao enviar sua review.');
    });
});

// Carrega as reviews quando a página carrega
carregarReviews();
