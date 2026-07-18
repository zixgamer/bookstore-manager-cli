import { rl } from "../utils/readline";
import { EmprestimoController } from "../controllers/EmprestimoController";
import { LivroController } from "../controllers/LivroController";
import { ClienteController } from "../controllers/ClienteController";

export class EmprestimoMenu {
  constructor(
    private emprestimoController: EmprestimoController,
    private livroController: LivroController,
    private clienteController: ClienteController,
  ) {}

  async iniciar(): Promise<void> {
    let sair = false;

    while (!sair) {
      console.log("Gestionamento dos emprestimos \n");
      console.log("1. Registrar Emprestimo");
      console.log("2. Devolver Livro");
      console.log("3. Listar Emprestimos");
      console.log("0. voltar");

      const opcao = await rl.question("Escolha uma opcao: ");

      switch (opcao) {
        case "1":
          await this.registrarEmprestimo();
          break;
        case "2":
          await this.devolver();
          break;
        case "3":
          console.log(await this.emprestimoController.listarTodos());
          break;
        case "0":
          sair = true;
          break;
        default:
          console.log("Opcao selecionada e invalida");
      }
    }
  }

  private async registrarEmprestimo(): Promise<void> {
    console.log("----Lista de Clientes----\n");
    console.log(await this.clienteController.listarTodos());

    console.log("----Lista de livros----\n");
    console.log(await this.livroController.listarTodos());

    console.log("----Novo emprestimo----\n");
    const clienteId = await rl.question("ID do cliente: ");
    const livroId = await rl.question("ID do livro: ");

    const resultado = await this.emprestimoController.criar(clienteId, livroId);
    console.log(resultado);
  }

  private async devolver(): Promise<void> {
    const id = await rl.question("O ID do emprestimo para devolucao: ");
    console.log(await this.emprestimoController.devolver(id));
  }
}
