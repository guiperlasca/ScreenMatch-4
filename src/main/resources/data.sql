-- Dados iniciais para o banco H2
-- Este arquivo será executado automaticamente pelo Spring Boot

-- Inserir usuário de teste
INSERT INTO usuarios (id, login, senha, nome, data_criacao) 
VALUES (1, 'admin@screenmatch.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Administrador', CURRENT_TIMESTAMP);

-- Inserir séries de exemplo (usando placeholder pois agora usamos API TMDB)
INSERT INTO series (id, titulo, ano, genero, diretor, atores, sinopse, poster, avaliacao, data_criacao) VALUES
(1, 'Breaking Bad', 2008, 'Drama, Crime', 'Vince Gilligan', 'Bryan Cranston, Aaron Paul', 'Um professor de química se transforma em fabricante de metanfetamina', 'placeholder.jpg', 9.5, CURRENT_TIMESTAMP),
(2, 'Game of Thrones', 2011, 'Drama, Fantasia', 'David Benioff, D.B. Weiss', 'Emilia Clarke, Kit Harington', 'Nobres famílias lutam pelo controle do Trono de Ferro', 'placeholder.jpg', 9.3, CURRENT_TIMESTAMP),
(3, 'Stranger Things', 2016, 'Drama, Fantasia, Horror', 'The Duffer Brothers', 'Millie Bobby Brown, Finn Wolfhard', 'Um grupo de crianças descobre segredos sobrenaturais', 'placeholder.jpg', 8.7, CURRENT_TIMESTAMP),
(4, 'The Crown', 2016, 'Drama, História', 'Peter Morgan', 'Olivia Colman, Helena Bonham Carter', 'A vida da Rainha Elizabeth II e da família real britânica', 'placeholder.jpg', 8.6, CURRENT_TIMESTAMP),
(5, 'The Mandalorian', 2019, 'Ação, Aventura, Fantasia', 'Jon Favreau', 'Pedro Pascal, Gina Carano', 'Um caçador de recompensas em uma galáxia muito, muito distante', 'placeholder.jpg', 8.8, CURRENT_TIMESTAMP),
(6, 'The Witcher', 2019, 'Ação, Aventura, Fantasia', 'Lauren Schmidt Hissrich', 'Henry Cavill, Anya Chalotra', 'Um caçador de monstros em um mundo de magia e criaturas', 'placeholder.jpg', 8.2, CURRENT_TIMESTAMP);

-- Inserir categorias
INSERT INTO categorias (id, nome, descricao) VALUES
(1, 'Drama', 'Séries com foco em desenvolvimento de personagens e conflitos emocionais'),
(2, 'Crime', 'Séries sobre atividades criminosas e investigações'),
(3, 'Fantasia', 'Séries com elementos mágicos e sobrenaturais'),
(4, 'História', 'Séries baseadas em eventos históricos reais'),
(5, 'Ação', 'Séries com sequências de ação e aventura'),
(6, 'Horror', 'Séries com elementos de terror e suspense');

-- Inserir episódios de exemplo
INSERT INTO episodios (id, serie_id, titulo, numero, temporada, sinopse, duracao, data_criacao) VALUES
(1, 1, 'Pilot', 1, 1, 'Walter White descobre que tem câncer e decide fabricar metanfetamina', 58, CURRENT_TIMESTAMP),
(2, 1, 'Cat''s in the Bag...', 2, 1, 'Walter e Jesse tentam se livrar de um corpo', 48, CURRENT_TIMESTAMP),
(3, 2, 'Winter Is Coming', 1, 1, 'Ned Stark é convidado para ser o novo Hand do Rei', 62, CURRENT_TIMESTAMP),
(4, 2, 'The Kingsroad', 2, 1, 'A família Stark viaja para o sul', 56, CURRENT_TIMESTAMP);

-- Inserir avaliações de exemplo
INSERT INTO avaliacoes (id, serie_id, usuario_id, nota, comentario, observacao, data_criacao) VALUES
(1, 1, 1, 10, 'Uma das melhores séries já feitas. Atuação incrível e roteiro perfeito.', 'Assisti várias vezes', CURRENT_TIMESTAMP),
(2, 2, 1, 9, 'Excelente adaptação dos livros. Visuais impressionantes.', 'Especialmente as primeiras temporadas', CURRENT_TIMESTAMP),
(3, 3, 1, 8, 'Muito boa para quem gosta de nostalgia dos anos 80.', 'Referências culturais interessantes', CURRENT_TIMESTAMP);

-- Inserir listas personalizadas de exemplo
INSERT INTO listas_personalizadas (id, usuario_id, nome, descricao, publica, tags, data_criacao) VALUES
(1, 1, 'Minhas Favoritas', 'As melhores séries que já assisti', true, 'favoritas,melhores,top', CURRENT_TIMESTAMP),
(2, 1, 'Para Assistir', 'Séries que quero ver em breve', false, 'watchlist,pendente', CURRENT_TIMESTAMP);

-- Inserir séries nas listas
INSERT INTO listas_series (lista_id, serie_id) VALUES
(1, 1), -- Breaking Bad na lista de favoritas
(1, 2), -- Game of Thrones na lista de favoritas
(2, 4), -- The Crown na lista para assistir
(2, 5); -- The Mandalorian na lista para assistir
