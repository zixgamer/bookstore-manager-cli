import { LivroService } from "../services/LivroService";
import { NumeroObrigatorio, DataObrigatoria } from "../utils/inputHelper";

export class LivroController {
  constructor(private livroService: LivroService) {}

  async criar(
    titulo: string,
    dataLancamento: string,
    quantidadeTotal: string,
    quantidadeDisponivel: string,
    autorId: string,
  ): Promise<string> {
    try {
      const data = DataObrigatoria(dataLancamento, "Data de lançamento");
      const qtdTotal = NumeroObrigatorio(quantidadeTotal, "Quantidade Total");
      const qtdDispo = NumeroObrigatorio(
        quantidadeDisponivel,
        "Quantidade Disponível",
      );
      const idAutor = NumeroObrigatorio(autorId, "ID do Autor");

      const novoLivro = await this.livroService.criar({
        titulo,
        dataLancamento: data,
        quantidadeTotal: qtdTotal,
        quantidadeDisponivel: qtdDispo,
        autorId: idAutor,
      });
      return `O livro foi cadastrado com sucesso; ID: ${novoLivro.id}, Titulo: ${novoLivro.titulo}`;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }

  async listarTodos(): Promise<string> {
    try {
      const livros = await this.livroService.listarTodos();
      if (livros.length === 0)
        return "Nenhum livro foi cadastrado até o momento.";

      let tabela = "ID  |  Título  |  Autor ID  |  Disponível  |  QTotal\n";
      livros.forEach((l) => {
        tabela += `${l.id}  | ${l.titulo}  |  ${l.autorId}  |  ${l.quantidadeDisponivel}  |  ${l.quantidadeTotal}\n`;
      });
      return tabela;
    } catch (error) {
      return `Erro ao tentar listar: ${(error as Error).message}`;
    }
  }

  async buscarPorId(idRaw: string): Promise<string> {
    try {
      const id = NumeroObrigatorio(idRaw, "ID do Livro");
      const livro = await this.livroService.buscarPorId(id);
      return `
      ------------------------------------------
      Informações sobre o livro: ${livro.titulo}
      ID: ${livro.id}
      Data de lançamento: ${livro.dataLancamento.toLocaleDateString()}
      Quantidade total: ${livro.quantidadeTotal}
      Quantidade Disponível: ${livro.quantidadeDisponivel}
      Autor ID: ${livro.autorId}
      ------------------------------------------
      `;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }

  async remover(idRaw: string): Promise<string> {
    try {
      const id = NumeroObrigatorio(idRaw, "ID do Livro");
      await this.livroService.remover(id);
      return `O livro com o ID ${id} foi removido com sucesso do sistema!`;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }

  async atualizar(
    idRaw: string,
    titulo: string,
    dataLancamento: string,
    quantidadeTotal: string,
    quantidadeDisponivel: string,
    autorId: string,
  ): Promise<string> {
    try {
      const id = NumeroObrigatorio(idRaw, "ID do Livro");
      const data = DataObrigatoria(dataLancamento, "Data de lançamento");
      const qtdTotal = NumeroObrigatorio(quantidadeTotal, "Quantidade Total");
      const qtdDispo = NumeroObrigatorio(
        quantidadeDisponivel,
        "Quantidade Disponível",
      );
      const idAutor = NumeroObrigatorio(autorId, "ID do Autor");

      await this.livroService.atualizar(id, {
        titulo,
        dataLancamento: data,
        quantidadeTotal: qtdTotal,
        quantidadeDisponivel: qtdDispo,
        autorId: idAutor,
      });

      return `O livro com o ID ${id} foi atualizado com sucesso!!`;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }
}
