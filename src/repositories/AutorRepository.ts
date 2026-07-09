import { pool } from "../database/connection";
import { Autor, AutorImpl } from "../models/Autor";

function mapearLinha(linha: any): AutorImpl {
  return new AutorImpl(linha.nome, linha.id);
}

export class AutorRepository {
  async criar(autor: Autor): Promise<Autor> {
    const resultado = await pool.query(
      "INSERT INTO autor (nome) VALUES ($1) RETURNING *",
      [autor.nome],
    );
    return mapearLinha(resultado.rows[0]);
  }

  async listarTodos(): Promise<Autor[]> {
    const resultado = await pool.query("SELECT * FROM autor ORDER BY nome");
    return resultado.rows.map(mapearLinha);
  }

  async buscarPorId(id: number): Promise<Autor | null> {
    const resultado = await pool.query("SELECT * FROM autor WHERE id = $1", [
      id,
    ]);
    if (resultado.rows.length === 0) return null;
    return mapearLinha(resultado.rows[0]);
  }

  async atualizar(id: number, autor: Autor): Promise<Autor | null> {
    const resultado = await pool.query(
      "UPDATE autor SET nome = $1 WHERE id = $2 RETURNING *",
      [autor.nome, id],
    );
    if (resultado.rows.length === 0) return null;
    return mapearLinha(resultado.rows[0]);
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await pool.query("DELETE FROM autor WHERE id = $1", [id]);
    return (resultado.rowCount ?? 0) > 0;
  }
}
