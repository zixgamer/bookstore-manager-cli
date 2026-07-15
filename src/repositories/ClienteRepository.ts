import { pool } from "../database/connection";
import { Cliente } from "../models/Cliente";

export class ClienteRepository {
  async criar(cliente: Cliente): Promise<Cliente> {
    const query = ` INSERT INTO cliente (nome, email) VALUES ($1, $2) RETURNING *;`;
    const values = [cliente.nome, cliente.email];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async listarTodos(): Promise<Cliente[]> {
    const query = "SELECT * FROM cliente ORDER BY id ASC;";
    const { rows } = await pool.query(query);
    return rows;
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const query = "SELECT * FROm cliente WHERE id = $1;";
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const query = "SELECT * FROM cliente WHERE email = $1;";
    const { rows } = await pool.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  async atualizar(
    id: number,
    cliente: Partial<Cliente>,
  ): Promise<Cliente | null> {
    const query = `UPDATE cliente SET nome = COALESCE($1, nome), email = COALESCE($2, email) WHERE id = $3 RETURNING *;`;
    const values = [cliente.nome, cliente.email, id];
    const { rows } = await pool.query(query, values);
    return rows.length > 0 ? rows[0] : null;
  }

  async remover(id: number): Promise<void> {
    const query = "DELETE FROM cliente WHERE id = $1;";
    await pool.query(query, [id]);
  }
}
