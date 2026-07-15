import { rl } from "../utils/readline";
import { AutorController } from "../controllers/AutorController";

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

export async function mostrarAutorMenu(controller: AutorController) {
  let executando = true;

  while (executando) {
    console.log("-----Gerenciamento de autores-----");
    console.log("1. Cadastrar um autor");
    console.log("2. Listar todos os Autores");
    console.log("3. Consultar Autor por ID");
    console.log("4. Atualizar Autor");
    console.log("5. Remover Autor");
    console.log("0. Voltar ao menu principal");

    const opcao = await question("Escolha uma opção: ");

    switch (opcao) {
      case "1": {
        const nome = await question("Digite o nome do autor: ");
        console.log(await controller.criar(nome));
        break;
      }
      case "2": {
        console.log(await controller.listarTodos());
        break;
      }
      case "3": {
        const id = await question("Digite o ID do autor para consultar: ");
        console.log(await controller.buscarPorId(id));
        break;
      }
      case "4": {
        const id = await question(
          "Digite o ID do autor que desejas atualizar: ",
        );
        const nome = await question("Digite o novo nome do autor: ");
        console.log(await controller.atualizar(id, nome));
        break;
      }
      case "5": {
        const id = await question("Digite o ID do autor que deseja remover: ");
        console.log(await controller.remover(id));
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
