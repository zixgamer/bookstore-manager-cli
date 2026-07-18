import { rl } from "../utils/readline";
import { RelatorioController } from "../controllers/RelatorioController";

export class RelatorioMenu {
  constructor(private relatorioController: RelatorioController) {}

  async iniciar(): Promise<void> {
    let sair = false;

    while (!sair) {
      console.log("----Menu De Relatorios----\n");
      console.log("1. Livros Disponiveis");
      console.log("2. Livros emprestados no momento");
      console.log("3. Livros por autor");
      console.log("4. Ranking de emprestimos por livro");
      console.log("5. Clientes com emprestimos ativos");
      console.log("0. Voltar ao menu principal");

      const opcao = await rl.question("Selecione uma opção:\n");

      console.log("\n");

      switch (opcao) {
        case "1":
          console.log(await this.relatorioController.listarLivroDisponivel());
          break;
        case "2":
          console.log(await this.relatorioController.listarLivroEmprestado());
          break;
        case "3":
          console.log(await this.relatorioController.listarLivroPorAutor());
          break;
        case "4":
          console.log(
            await this.relatorioController.contarEmprestimoPorLivro(),
          );
          break;
        case "5":
          console.log(
            await this.relatorioController.listarClienteComEmprestimoAtivo(),
          );
          break;
        case "0":
          sair = true;
          break;
        default:
          console.log("Opcao selecionada e invalida!! Tente novamente");
      }
    }
  }
}
