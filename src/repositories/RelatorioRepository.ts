import { pool } from "../database/connection";

export class RelatorioRepository {
  async listarLivroDisponivel(): Promise<any[]> {
    const query = ` 
    SELECT id, titulo, quantidade_disponivel, quantidade_total
    FROM livro
    WHERE quantidade_disponivel > 0
    ORDER BY titulo ASC;`;

    const { rows } = await pool.query(query);
    return rows;
  }

  async listarLivroEmprestado(): Promise<any[]> {
    const query = `
    SELECT
      l.id AS livro_id,
      l.titulo,
      e.data_emprestimo,
      c.nome AS cliente_nome
    FROM livro l
    JOIN emprestimo e ON l.id = e.fk_livro_id
    JOIN cliente c ON e.fk_cliente_id = c.id
    WHERE e.data_devolucao IS NULL
    ORDER BY e.data_emprestimo ASC;`;

    const { rows } = await pool.query(query);
    return rows;
  }

  async listarLivroPorAutor(): Promise<any[]> {
    const query = `
    SELECT 
      a.nome AS autor,
      l.titulo,
      l.quantidade_total
    FROM livro l
    JOIN autor a ON l.fk_autor_id = a.id
    ORDER BY a.nome ASC, l.titulo ASC;`;

    const { rows } = await pool.query(query);
    return rows;
  }

  async totalEmprestimoPorLivro(): Promise<any[]> {
    const query = `
    SELECT
      l.id,
      l.titulo,
      COUNT(e.id) AS total_emprestimos
    FROM livro l
    LEFT JOIN emprestimo e ON l.id =e.fk_livro_id
    GROUP BY l.id, l.titulo
    ORDER BY total_emprestimos DESC, l.titulo 
    LIMIT 10;`;

    const { rows } = await pool.query(query);
    return rows;
  }

  async listarClienteComEmprestimoAtivo(): Promise<any[]> {
    const query = `
    SELECT
      c.id,
      c.nome,
      c.email,
      COUNT(e.id) AS emprestimos_ativos
    FROM cliente c
    JOIN emprestimo e ON c.id = e.fk_cliente_id
    WHERE e.data_devolucao IS NULL
    GROUP BY c.id, c.nome, c.email
    ORDER BY emprestimos_ativos DESC, c.nome ASC;`;

    const { rows } = await pool.query(query);
    return rows;
  }
}
