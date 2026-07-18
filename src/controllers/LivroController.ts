import { LivroImpl } from "../models/Livro";
import { LivroService } from "../services/LivroService";
import { numeroObrigatorio, dataObrigatoria } from "../utils/inputHelper";

export class LivroController {
  constructor(private livroService: LivroService) {}

  async criar(
    titulo: string,
    dataLancamento: string,
    quantidadeTotal: string,
    quantidadeDisponivel: string,
    fk_autor_id: string,
  ): Promise<string> {
    try {
      const data = dataObrigatoria(dataLancamento, "Data de lançamento");
      const qtdTotal = numeroObrigatorio(quantidadeTotal, "Quantidade Total");
      const qtdDispo = numeroObrigatorio(
        quantidadeDisponivel,
        "Quantidade Disponível",
      );
      const idAutor = numeroObrigatorio(fk_autor_id, "ID do Autor");

      const novoLivro = new LivroImpl(
        titulo,
        data,
        qtdTotal,
        qtdDispo,
        idAutor,
      );
      const livroCriado = await this.livroService.criar(novoLivro);
      return `O livro foi cadastrado com sucesso; ID: ${livroCriado.id}, Titulo: ${livroCriado.titulo}`;
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
        tabela += `${l.id}  | ${l.titulo}  |  ${l.autorid}  |  ${l.quantidadeDisponivel}  |  ${l.quantidadeTotal}\n`;
      });
      return tabela;
    } catch (error) {
      return `Erro ao tentar listar: ${(error as Error).message}`;
    }
  }

  async buscarPorId(idRaw: string): Promise<string> {
    try {
      const id = numeroObrigatorio(idRaw, "ID do Livro");
      const livro = await this.livroService.buscarPorId(id);
      return `
      ------------------------------------------
      Informações sobre o livro: ${livro.titulo}
      ID: ${livro.id}
      Data de lançamento: ${livro.dataLancamento.toLocaleDateString()}
      Quantidade total: ${livro.quantidadeTotal}
      Quantidade Disponível: ${livro.quantidadeDisponivel}
      Autor ID: ${livro.autorid}
      ------------------------------------------
      `;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }

  async remover(idRaw: string): Promise<string> {
    try {
      const id = numeroObrigatorio(idRaw, "ID do Livro");
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
      const id = numeroObrigatorio(idRaw, "ID do Livro");
      const data = dataObrigatoria(dataLancamento, "Data de lançamento");
      const qtdTotal = numeroObrigatorio(quantidadeTotal, "Quantidade Total");
      const qtdDispo = numeroObrigatorio(
        quantidadeDisponivel,
        "Quantidade Disponível",
      );
      const idAutor = numeroObrigatorio(autorId, "ID do Autor");

      const livroParaAtualizar = new LivroImpl(
        titulo,
        data,
        qtdTotal,
        qtdDispo,
        idAutor,
        id,
      );
      await this.livroService.atualizar(id, livroParaAtualizar);

      return `O livro com o ID ${id} foi atualizado com sucesso!!`;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }
}
