import { rl } from "../utils/readline";
import { LivroController } from "../controllers/LivroController";
import { AutorController } from "../controllers/AutorController";

export class LivroMenu {
  constructor(
    private livroController: LivroController,
    private autorController: AutorController,
  ) {}

  async iniciar(): Promise<void> {
    let sair = false;

    while (!sair) {
      console.log("----Gestão dos livros-----");
      console.log("1. Cadastrar um livro");
      console.log("2. Listar os livros");
      console.log("3. Consultar livro por ID");
      console.log("4. Atualizar dados de um livro");
      console.log("5. Remover um livro");
      console.log("0. Voltar");

      const opcao = await rl.question("Escolha uma das opções acima: ");

      switch (opcao) {
        case "1":
          await this.cadastrar();
          break;
        case "2":
          console.log(await this.livroController.listarTodos());
          break;
        case "3":
          await this.buscarPorId();
          break;
        case "4":
          await this.atualizar();
          break;
        case "5":
          await this.remover();
          break;
        case "0":
          sair = true;
          break;
        default:
          console.log("Opção inválida. Tente novamente.");
      }
    }
  }

  private async cadastrar(): Promise<void> {
    console.log("----Cadastro de um novo livro-----");
    console.log("Autores disponíveis:");
    console.log(await this.autorController.listarTodos());

    const autorId = await rl.question("Digite o ID do autor: ");
    const titulo = await rl.question("Titulo do livro: ");
    const dataLancamento = await rl.question("Data de lançamento (AAAA-MM-DD)");
    const quantidadeTotal = await rl.question("Quantidade Total: ");
    const quantidadeDisponivel = await rl.question("Quantidade Disponivel: ");

    const resultado = await this.livroController.criar(
      titulo,
      dataLancamento,
      quantidadeTotal,
      quantidadeDisponivel,
      autorId,
    );
    console.log(resultado);
  }

  private async buscarPorId(): Promise<void> {
    const id = await rl.question("Digite o ID do livro: ");
    console.log(await this.livroController.buscarPorId(id));
  }

  private async atualizar(): Promise<void> {
    console.log("-----Atualizar dados de um livro-----");
    const id = await rl.question(
      "Digite o ID do livro que deseja atualizar os dados: ",
    );

    console.log("Autores disponíveis no sistema:");
    console.log(await this.autorController.listarTodos());

    const autorId = await rl.question("Novo ID do autor: ");
    const titulo = await rl.question("Novo titulo do livro: ");
    const dataLancamento = await rl.question(
      "Nova data de lançamento do livro (AAAA-MM-DD)",
    );
    const quantidadeTotal = await rl.question("Nova quantidade total: ");
    const quantidadeDisponivel = await rl.question(
      "Nova quantidade disponivel: ",
    );

    const resultado = await this.livroController.atualizar(
      id,
      titulo,
      dataLancamento,
      quantidadeTotal,
      quantidadeDisponivel,
      autorId,
    );
    console.log(resultado);
  }

  private async remover(): Promise<void> {
    const id = await rl.question(
      "Digite o ID do livro que deseja que seja removido: ",
    );
    console.log(await this.livroController.remover(id));
  }
}
