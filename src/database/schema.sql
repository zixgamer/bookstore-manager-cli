CREATE TABLE autor (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL
);

CREATE TABLE livro (
	id SERIAL PRIMARY KEY,
	titulo VARCHAR(150) NOT NULL,
	data_lancamento DATE,
	quantidade_total INTEGER NOT NULL,
	quantidade_disponivel INTEGER NOT NULL,
	fk_autor_id INTEGER NOT NULL REFERENCES autor(id),
	UNIQUE (titulo, fk_autor_id)
);

CREATE TABLE cliente (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE emprestimo (
	id SERIAL PRIMARY KEY,
	data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
	data_devolucao DATE,
	fk_cliente_id INTEGER NOT NULL REFERENCES cliente(id),
	fk_livro_id INTEGER NOT NULL REFERENCES livro(id)
);