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
}
