import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
  console.error("Erro inesperado no pool", err);
});

export async function testarConexao(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log("Conexão com o banco estabelecida com sucesso.");
  } finally {
    client.release();
  }
}

if (require.main === module) {
  testarConexao()
    .then(() => {
      pool.end();
    })
    .catch((err) => {
      console.error("Falha ao conectar com o banco:", err);
      process.exit(1);
    });
}
