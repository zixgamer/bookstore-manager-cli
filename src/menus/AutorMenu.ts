import { rl } from "../utils/readline";
import { AutorController } from "../controllers/AutorController";

export class AutorMenu {
  constructor(private controller: AutorController) {}

  async iniciar(): Promise<void> {
    let executando = true;

    while (executando) {
      console.log("-----Gerenciamento de autores-----");
      console.log("1. Cadastrar um autor");
      console.log("2. Listar todos os Autores");
      console.log("3. Consultar Autor por ID");
      console.log("4. Atualizar Autor");
      console.log("5. Remover Autor");
      console.log("0. Voltar ao menu principal");

      const opcao = await rl.question("Escolha uma opção: ");

      switch (opcao) {
        case "1": {
          const nome = await rl.question("Digite o nome do autor: ");
          console.log(await this.controller.criar(nome));
          break;
        }
        case "2": {
          console.log(await this.controller.listarTodos());
          break;
        }
        case "3": {
          const id = await rl.question("Digite o ID do autor para consultar: ");
          console.log(await this.controller.buscarPorId(id));
          break;
        }
        case "4": {
          const id = await rl.question(
            "Digite o ID do autor que desejas atualizar: ",
          );
          const nome = await rl.question("Digite o novo nome do autor: ");
          console.log(await this.controller.atualizar(id, nome));
          break;
        }
        case "5": {
          const id = await rl.question(
            "Digite o ID do autor que deseja remover: ",
          );
          console.log(await this.controller.remover(id));
          break;
        }
        case "0": {
          executando = false;
          console.log("Voltando ao menu anterior...");
          break;
        }
        default:
          console.log("Opção inválida!! Tente novamente com uma opção valida.");
      }
    }
  }
}
