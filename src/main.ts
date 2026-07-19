import { pool } from "./database/connection";
import { rl } from "./utils/readline";
import { testarConexao } from "./database/connection";

// Repositorios
import { AutorRepository } from "./repositories/AutorRepository";
import { ClienteRepository } from "./repositories/ClienteRepository";
import { EmprestimoRepository } from "./repositories/EmprestimoRepository";
import { LivroRepository } from "./repositories/LivroRepository";
import { RelatorioRepository } from "./repositories/RelatorioRepository";

// Services
import { AutorService } from "./services/AutorService";
import { ClienteService } from "./services/ClienteService";
import { EmprestimoService } from "./services/EmprestimoService";
import { LivroService } from "./services/LivroService";
import { RelatorioService } from "./services/RelatorioService";

// Controllers
import { AutorController } from "./controllers/AutorController";
import { ClienteController } from "./controllers/ClienteController";
import { EmprestimoController } from "./controllers/EmprestimoController";
import { LivroController } from "./controllers/LivroController";
import { RelatorioController } from "./controllers/RelatorioController";

// Menus
import { AutorMenu } from "./menus/AutorMenu";
import { ClienteMenu } from "./menus/ClienteMenu";
import { EmprestimoMenu } from "./menus/EmprestimoMenu";
import { LivroMenu } from "./menus/LivroMenu";
import { RelatorioMenu } from "./menus/RelatorioMenu";

async function main() {
  await testarConexao();

  // Repositorios
  const autorRepo = new AutorRepository();
  const clienteRepo = new ClienteRepository();
  const emprestimoRepo = new EmprestimoRepository();
  const livroRepo = new LivroRepository();
  const relatorioRepo = new RelatorioRepository();

  // Services
  const autorServ = new AutorService(autorRepo);
  const clienteServ = new ClienteService(clienteRepo);
  const livroServ = new LivroService(livroRepo, autorServ);
  const emprestimoServ = new EmprestimoService(
    emprestimoRepo,
    livroRepo,
    clienteRepo,
  );
  const relatorioServ = new RelatorioService(relatorioRepo);

  // Controllers
  const autorControl = new AutorController(autorServ);
  const livroControl = new LivroController(livroServ);
  const clienteControl = new ClienteController(clienteServ);
  const emprestimoControl = new EmprestimoController(emprestimoServ);
  const relatorioControl = new RelatorioController(relatorioServ);

  // Menus
  const autorMenu = new AutorMenu(autorControl);
  const livroMenu = new LivroMenu(livroControl, autorControl);
  const clienteMenu = new ClienteMenu(clienteControl);
  const emprestimoMenu = new EmprestimoMenu(
    emprestimoControl,
    livroControl,
    clienteControl,
  );
  const relatorioMenu = new RelatorioMenu(relatorioControl);

  let sair = false;
  while (!sair) {
    console.log("\n----BookStore Manager----\n");
    console.log("1. Autores");
    console.log("2. Livros");
    console.log("3. Clientes");
    console.log("4. Empréstimos");
    console.log("5. Relatórios");
    console.log("0. Encerrar Sessão");

    const opcao = await rl.question("Escolha uma opção: ");

    switch (opcao) {
      case "1":
        await autorMenu.iniciar();
        break;
      case "2":
        await livroMenu.iniciar();
        break;
      case "3":
        await clienteMenu.iniciar();
        break;
      case "4":
        await emprestimoMenu.iniciar();
        break;
      case "5":
        await relatorioMenu.iniciar();
        break;
      case "0":
        sair = true;
        console.log("Encerrando a sessão...");
        break;
      default:
        console.log("Opção inválida! Tente novamente.");
    }
  }

  rl.close();
  await pool.end();
}

main().catch((erro) => {
  console.error("Erro fatal no CLI: ", erro);
  process.exit(1);
});
