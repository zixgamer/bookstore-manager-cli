import { pool } from "../database/connection";
import { Livro, LivroImpl } from "../models/Livro";

function mapearLinha(linha: any): LivroImpl {
  return new LivroImpl(
    linha.titulo,
    new Date(linha.data_lancamento),
    Number(linha.quantidade_total),
    Number(linha.quantidade_disponivel),
    Number(linha.fk_autor_id),
    linha.id,
  );
}

export class LivroRepository {
  async criar(livro: Livro): Promise<Livro> {
    const resultado = await pool.query(
      `INSERT INTO livro (titulo, data_lancamento, quantidade_total, quantidade_disponivel, fk_autor_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        livro.titulo,
        livro.dataLancamento,
        livro.quantidadeTotal,
        livro.quantidadeDisponivel,
        livro.autorId,
      ],
    );
    return mapearLinha(resultado.rows[0]);
  }

  async listarTodos(): Promise<Livro[]> {
    const resultado = await pool.query("SELECT * FROM livro ORDER BY titulo");
    return resultado.rows.map(mapearLinha);
  }

  async buscarPorId(id: number): Promise<Livro | null> {
    const resultado = await pool.query("SELECT * FROM livro WHERE id = $1", [
      id,
    ]);
    if (resultado.rows.length === 0) return null;
    return mapearLinha(resultado.rows[0]);
  }

  async atualizar(id: number, livro: Livro): Promise<Livro | null> {
    const resultado = await pool.query(
      `UPDATE livro SET titulo = $1, data_lancamento = $2, quantidade_total = $3, quantidade_disponivel = $4, fk_autor_id = $5 WHERE id = $6 RETURNING *`,
      [
        livro.titulo,
        livro.dataLancamento,
        livro.quantidadeTotal,
        livro.quantidadeDisponivel,
        livro.autorId,
        id,
      ],
    );
    if (resultado.rows.length === 0) return null;
    return mapearLinha(resultado.rows[0]);
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await pool.query("DELETE FROM livro WHERE id = $1", [id]);
    return (resultado.rowCount ?? 0) > 0;
  }
}
