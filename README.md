## BookStore Manager CLI

O **BookStore Manager CLI** é um sistema de gerenciamento de livraria executado inteiramente via linha de comando (terminal).

Trata-se de uma aplicação back-end interativa desenvolvida para gerenciar fluxos completos de uma livraria. O sistema recebe as entradas do usuário pelo terminal e persiste as informações de forma segura em um banco de dados relacional PostgreSQL.

## 2. Objetivo

Este projeto foi desenvolvido como trabalho prático final do módulo 1 do curso. O principal objetivo é aplicar e consolidar conceitos aprendidos durante o módulo 1, incluindo:

- Programação Orientada a Objetos (POO).
- Separação de responsabilidades utilizando arquitetura em camadas (Clean Architecture).
- Integração e modelagem de banco de dados relacional.
- Tratamento de erros de negócio.

## 3. Tecnologias utilizadas

- **Node.js**
- **TypeScript**
- **PostgreSQL**
- **pg (node-postgres)**
- **dotenv**
- **ts-node**

## 4. Requisitos para execução

Para rodar este projeto, você precisa ter instalado em sua máquina:

- **Node.js** (versão 18.x ou superior)
- **PostgreSQL** (versão 12.x ou superior)
- **npm** (gerenciador de pacotes, já incluso no Node.js)

## 5. Configuração do banco de dados

1. Acesse o terminal do seu PostgreSQL e crie o banco de dados. Sugerimos o nome:

```sql
CREATE DATABASE bookstore_db;

```

2. Execute o arquivo contendo o schema para criar todas as tabelas. No terminal, rode o comando exato (substituindo pelo seu usuário):

```bash
psql -U postgres -d bookstore_db -f src/database/schema.sql

```

3. O sistema exige configurações de ambiente para conectar ao banco. O seu arquivo `.env` precisará ter exatamente as seguintes variáveis:

```env
PGHOST=
PGPORT=
PGUSER=
PGPASSWORD=
PGDATABASE=

```

## 6. Instalação

1. Clone o repositório para a sua máquina:

```bash
git clone https://github.com/zixgamer/bookstore-manager-cli.git
cd bookstore-manager-cli

```

2. Instale as dependências do projeto:

```bash
npm install

```

3. Crie o arquivo `.env` na raiz do projeto. Você pode rodar o comando abaixo no terminal para criar o arquivo já com a estrutura necessária:

```bash
echo -e "PGHOST=\nPGPORT=\nPGUSER=\nPGPASSWORD=\nPGDATABASE=" > .env

```

## 7. Execução

Para iniciar o sistema e abrir o menu principal interativo, execute o comando padrão:

```bash
npm run dev

```

Para encerrar a aplicação com segurança a qualquer momento, basta escolher a opção **`0`** (Encerrar Sessão) no menu principal.

## 8. A arquitetura do projeto

O sistema foi estruturado seguindo os princípios de camadas para isolar responsabilidades:

O fluxo de dados começa na camada de **Menus**, que é responsável por exibir a interface no terminal e ler as opções e textos digitados pelo usuário. Essa entrada é enviada para os **Controllers**, que atuam recebendo a string do terminal, convertendo o que é necessário e chamando a lógica adequada.

A lógica verdadeira vive nos **Services**. É nessa camada que as regras de negócio existem: o sistema verifica se o livro tem estoque, se o cliente já existe ou se as datas fazem sentido antes de prosseguir. Somente se tudo estiver correto o Service envia os dados para os **Repositories**. Os repositórios têm uma única função: conversar com o banco de dados (via biblioteca `pg`), executando as consultas SQL no **PostgreSQL** e devolvendo a resposta de volta pelo mesmo caminho.

## 9. Funcionalidades implementadas

- **Autores:** Criação, leitura, atualização e exclusão de autores. Impede a remoção de um autor que já possua livros vinculados.
- **Livros:** Gestão do catálogo, exigindo título e controlando a quantidade total e disponível. Impede remoção de livros que possuam histórico de empréstimo.
- **Clientes:** Cadastro, edição e listagem. Valida dados de entrada e garante que não haja e-mails duplicados cadastrados.
- **Empréstimos:** Registro de novos empréstimos, deduzindo automaticamente a quantidade disponível do livro. Registro de devoluções, restaurando o estoque, e impedindo devoluções duplicadas.
- **Relatórios:** Geração de consultas estratégicas para listar: todos os livros disponíveis, livros emprestados com devolução pendente, livros agrupados por autor, o top 10 dos livros mais emprestados e os clientes com mais empréstimos ativos.

## 10. Estrutura das pastas

```text
bookstore-manager-cli/
├── src/
│   ├── controllers/      # Conecta a interface do terminal às regras de negócio
│   ├── database/         # Configurações do PostgreSQL e schemas (SQL)
│   ├── menus/            # Lógica de interface de texto interativa (CLI)
│   ├── models/           # Classes e Interfaces que representam as entidades
│   ├── repositories/     # Arquivos que executam as queries SQL diretamente no banco
│   ├── services/         # Onde residem as validações e as regras de negócio
│   ├── utils/            # Ferramentas auxiliares, tratamento de input e classes de Erro
│   └── main.ts           # Ponto de entrada (Entrypoint) principal da aplicação
├── .env.example          # Template das chaves de ambiente
├── package.json          # Dependências do Node e scripts
└── tsconfig.json         # Configuração do compilador TypeScript

```

## 11. Exemplos de utilização

Ao executar o projeto, você verá o Menu Principal da aplicação:

```text
----BookStore Manager----

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar Sessão
Escolha uma opção:

```

**Exemplo de Fluxo Completo (Cadastros e Empréstimo):**

1. Escolhendo a opção **1**, o sistema exibe o submenu de Autores. Você escolhe "Cadastrar Autor" e digita `J.K. Rowling`. O sistema retorna sucesso.
2. Voltando ao menu, você escolhe a opção **2** (Livros), seleciona "Cadastrar Livro", digite `Harry Potter`, informa a quantidade total de cópias e vincula ao ID da autora recém-criada.
3. No menu **3** (Clientes), você cadastra `João Silva` com o email `joao@email.com`.
4. Por fim, no menu **4** (Empréstimos), você seleciona "Registrar Empréstimo", digite o ID do livro e o ID do cliente. O sistema aprova, grava no banco e subtrai automaticamente 1 cópia da disponibilidade do livro.

## 12. Integrante

- Gabriel Vitkoshi

## 13. Link do Kanban

https://trello.com/invite/b/6a4d7f5d3333e8d8093c391f/ATTI6aa002fe8802b87bd1c2f3ae299886e2F251163F/bookstore-manager-cli
