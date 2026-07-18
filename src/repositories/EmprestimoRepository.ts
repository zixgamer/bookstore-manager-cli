import { pool } from "../database/connection";
import { EmprestimoImpl } from "../models/Emprestimo";

export class EmprestimoRepository {
  async criar(emprestimo: EmprestimoImpl): Promise<EmprestimoImpl> {
    const query = `INSERT INTO emprestimo (fk_cliente_id, fk_livro_id, data_emprestimo, data_devolucao) VALUES ($1, $2, $3, $4) RETURNING *`;

    const values = [
      emprestimo.clienteId,
      emprestimo.livroId,
      emprestimo.dataEmprestimo,
      emprestimo.dataDevolucao ?? null,
    ];

    const { rows } = await pool.query(query, values);
    return this.mapearLinha(rows[0]);
  }
  private mapearLinha(row: any): EmprestimoImpl {
    return new EmprestimoImpl(
      new Date(row.data_emprestimo),
      row.fk_cliente_id,
      row.fk_livro_id,
      row.id,
      row.data_devolucao ? new Date(row.data_devolucao) : undefined,
    );
  }

  async buscarPorId(id: number): Promise<EmprestimoImpl | null> {
    const query = "SELECT * FROM emprestimo WHERE id = $1";
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    return this.mapearLinha(rows[0]);
  }

  async registrarDevolucao(id: number): Promise<void> {
    await pool.query(
      "UPDATE emprestimo SET data_devolucao = NOW() WHERE id = $1",
      [id],
    );
  }

  async listarCompleto(): Promise<any[]> {
    const query = `
    SELECT 
      e.id, e.data_emprestimo, e.data_devolucao,
      c.nome as cliente_nome,
      l.titulo as livro_titulo
    FROM emprestimo e 
    JOIN cliente c ON e.fk_cliente_id = c.id
    JOIN livro l ON e.fk_livro_id = l.id
    ORDER BY e.data_emprestimo DESC;`;

    const { rows } = await pool.query(query);
    return rows;
  }
}
