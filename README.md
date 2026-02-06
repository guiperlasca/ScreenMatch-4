# ScreenMatch 🎬

O **ScreenMatch** é uma aplicação web de **catálogo de séries** desenvolvida com **Spring Boot**. O sistema permite o **gerenciamento e visualização de informações sobre séries**, integrando-se com **APIs externas** para busca de dados e oferecendo um fluxo completo de **autenticação e persistência**.

---

## 🚀 Tecnologias Utilizadas

* **Java 21** — versão da linguagem para aproveitar recursos mais recentes
* **Spring Boot 3.1.1** — framework base da aplicação
* **Spring Data JPA** — persistência e ORM
* **Spring Security** — segurança e controle de acesso
* **JWT (JSON Web Token)** — autenticação segura entre cliente e servidor
* **H2 Database** — banco em memória para desenvolvimento e testes
* **PostgreSQL** — suporte configurado para ambiente de produção
* **Maven** — gerenciamento de dependências e build
* **OpenAI GPT-3 Java** — integração para funcionalidades baseadas em IA

---

## 📋 Funcionalidades

* ✅ **Catálogo de Séries:** visualização e gerenciamento de séries de TV
* ✅ **Autenticação:** login seguro utilizando **tokens JWT**
* ✅ **Integração com OMDB:** busca automática de dados de séries através da **API OMDB**
* ✅ **Validação de Dados:** garantia de integridade com **Spring Validation**
* ✅ **Console H2:** interface para gerenciamento do banco de dados em ambiente de desenvolvimento

---

## 🔧 Configuração e Instalação

### Pré-requisitos

* **Java 21 (JDK)**
* **Maven 3.8+**

### Passo a Passo

#### 1️⃣ Clone o repositório

```bash
git clone https://github.com/guiperlasca/screenmatch-4.git
cd screenmatch-4
```

#### 2️⃣ Configure as variáveis de ambiente

O projeto utiliza uma chave secreta para JWT e uma chave da API OMDB, configuradas no arquivo `application.properties`:

```properties
omdb.apikey=SUA_CHAVE_OMDB
jwt.secret=SUA_CHAVE_JWT
```

#### 3️⃣ Execute a aplicação

```bash
./mvnw spring-boot:run
```

#### 4️⃣ Acesse a aplicação

* 🌐 Aplicação: `http://localhost:8080`

---

## 🗄️ Banco de Dados

Por padrão, a aplicação está configurada para utilizar o **H2 em memória**.

### Console H2

* **URL:** `http://localhost:8080/h2-console`
* **JDBC URL:** `jdbc:h2:mem:screenmatch`
* **Usuário:** `sa`

### Carga de Dados Inicial

Os dados iniciais são carregados automaticamente através dos arquivos:

* `src/main/resources/schema.sql`
* `src/main/resources/data.sql`

---

## ✒️ Autor

**Guilherme Perlasca**
Desenvolvedor do projeto
GitHub: **@guiperlasca**

---

## 📚 Créditos

Este projeto foi desenvolvido como parte de um programa de aprendizado na **Alura**.
