import { rl } from "../utils/readline";
import { ClienteController } from "../controllers/ClienteController";

export class ClienteMenu {
  constructor(private clineteController: ClienteController) {}

  async iniciar(): Promise<void> {
    let sair = false;

    while (!sair) {
      console.log("Gestão de clientes \n");
      console.log("1. Cadastrar Cliente");
      console.log("2. Listar todos os clientes");
      console.log("3. Consultar cliente por ID");
      console.log("4. Atualizar cliente");
      console.log("5. Remover cliente");
      console.log("0. Voltar");

      const opcao = await rl.question("Escolha uma opção:  \n");

      switch (opcao) {
        case "1":
          await this.cadastrar();
          break;
        case "2":
          console.log(await this.clineteController.listarTodos());
          break;
        case "3":
          await this.buscarPorId();
          break;
        case "4":
          await this.atualizarTodos();
          break;
        case "5":
          await this.remover();
          break;
        case "0":
          sair = true;
          break;
        default:
          console.log("Opção inválide! Tente novamente");
      }
    }
  }

  private async cadastrar(): Promise<void> {
    console.log("Cadastrar novo cliente \n");
    const nome = await rl.question("nome: ");
    const email = await rl.question("Email: ");

    console.log(await this.clineteController.criar(nome, email));
  }

  private async buscarPorId(): Promise<void> {
    const id = await rl.question("Digite o ID do cliente: \n");
    console.log(await this.clineteController.buscarPorId(id));
  }

  private async atualizarTodos(): Promise<void> {
    console.log("Atualizar Cliente \n");
    const id = await rl.question(
      "Digite o ID do cliente que desejas atualizar",
    );
    console.log("Caso deseje não alterar o campo, basta deixar em branco");

    const nome = await rl.question("Novo Nome: ");
    const email = await rl.question("Novo Email: ");

    console.log(await this.clineteController.atualizar(id, nome, email));
  }

  private async remover(): Promise<void> {
    const id = await rl.question("Digite o ID do cliente que será removido: ");
    console.log(await this.clineteController.remover(id));
  }
}
