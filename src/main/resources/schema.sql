-- Schema SQL para o banco de dados CineVault
-- Este arquivo será executado automaticamente pelo Spring Boot

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de séries
CREATE TABLE IF NOT EXISTS series (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    ano INTEGER,
    genero VARCHAR(255),
    diretor VARCHAR(255),
    atores TEXT,
    sinopse TEXT,
    poster VARCHAR(500),
    avaliacao DECIMAL(3,1),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
);

-- Tabela de episódios
CREATE TABLE IF NOT EXISTS episodios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    serie_id BIGINT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    numero INTEGER NOT NULL,
    temporada INTEGER NOT NULL,
    sinopse TEXT,
    duracao INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (serie_id) REFERENCES series(id)
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    serie_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 10),
    comentario TEXT NOT NULL,
    observacao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (serie_id) REFERENCES series(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    UNIQUE(serie_id, usuario_id)
);

-- Tabela de listas personalizadas
CREATE TABLE IF NOT EXISTS listas_personalizadas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    publica BOOLEAN DEFAULT false,
    tags VARCHAR(500),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de relacionamento entre listas e séries
CREATE TABLE IF NOT EXISTS listas_series (
    lista_id BIGINT NOT NULL,
    serie_id BIGINT NOT NULL,
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lista_id, serie_id),
    FOREIGN KEY (lista_id) REFERENCES listas_personalizadas(id),
    FOREIGN KEY (serie_id) REFERENCES series(id)
);

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    usuario_id BIGINT NOT NULL,
    serie_id BIGINT NOT NULL,
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, serie_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (serie_id) REFERENCES series(id)
);

-- Tabela de reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    serie_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    titulo VARCHAR(255),
    conteudo TEXT NOT NULL,
    nota INTEGER CHECK (nota >= 1 AND nota <= 10),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (serie_id) REFERENCES series(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_series_titulo ON series(titulo);
CREATE INDEX IF NOT EXISTS idx_series_ano ON series(ano);
CREATE INDEX IF NOT EXISTS idx_series_genero ON series(genero);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_serie ON avaliacoes(serie_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_usuario ON avaliacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_listas_usuario ON listas_personalizadas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reviews_serie ON reviews(serie_id);
CREATE INDEX IF NOT EXISTS idx_reviews_usuario ON reviews(usuario_id);
