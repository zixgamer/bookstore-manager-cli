import { Livro } from "../models/Livro";
import { LivroService } from "../services/LivroService";

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
      const data = new Date(dataLancamento);
      const qtdTotal = parseInt(quantidadeTotal);
      const qtdDispo = parseInt(quantidadeDisponivel);
      const idAutor = parseInt(autorId);

      if (
        isNaN(data.getTime()) ||
        isNaN(qtdTotal) ||
        isNaN(qtdDispo) ||
        isNaN(idAutor)
      ) {
        return "Erro: Formato enviado é inválido. verifique os numeros e a data digitados (AAAA-MM-DD)";
      }

      const novoLivro = await this.livroService.criar({
        titulo,
        dataLancamento: data,
        quantidadeTotal: qtdTotal,
        quantidadeDisponivel: qtdDispo,
        autorId: idAutor,
      });
      return `O livro foi cadastrado com suceso; ID: ${novoLivro.id}, Titulo ${novoLivro.titulo}`;
    } catch (error) {
      return `Houve um erro ao tentar cadastrar o livro: ${(error as Error).message}`;
    }
  }

  async listarTodos(): Promise<string> {
    try {
      const livros = await this.livroService.listarTodos();
      if (livros.length === 0) return "Nenhum foi cadastrado até o momento";

      let tabela = "ID  |  Título  |  Autor ID  |  Disponível  |  QTotal";
      livros.forEach((l) => {
        tabela += `${l.id}  | ${l.titulo}  |  ${l.autorId}  |  ${l.quantidadeDisponivel}  |  ${l.quantidadeTotal}`;
      });
      return tabela;
    } catch (error) {
      return `Erro ao tentar listar: ${(error as Error).message}`;
    }
  }

  async buscarPorId(idRaw: string): Promise<string> {
    try {
      const id = parseInt(idRaw);
      if (isNaN(id))
        return "Erro ao buscar o ID digitado, favor digitar um número válido";

      const livro = await this.livroService.buscarPorId(id);
      return `
      ------------------------------------------\n
      Informações sobre o livro: ${livro.titulo}\n
      ID: ${livro.id}\n
      Data de lançamento: ${livro.dataLancamento.toLocaleString()}\n
      Quantidade total: ${livro.quantidadeTotal}\n
      Quantidade Disponível: ${livro.quantidadeDisponivel}\n
      Autor ID: ${livro.autorId}\n
      ------------------------------------------
      `;
    } catch (error) {
      return `Erro ao buscar informações sobre o livro requisitado: ${(error as Error).message}`;
    }
  }

  async remover(idRaw: string): Promise<string> {
    try {
      const id = parseInt(idRaw);
      if (isNaN(id))
        return "Erro ao tentar remover o ID inserido. Insira um ID válido";

      await this.livroService.remover(id);
      return `O livro com o ID ${id} foi removido com sucesso do sistema!`;
    } catch (error) {
      return `Erro ao tentar remover este ID ${(error as Error).message}`;
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
      const id = parseInt(idRaw);
      const data = new Date(dataLancamento);
      const qtdTotal = parseInt(quantidadeTotal);
      const qtdDispo = parseInt(quantidadeDisponivel);
      const idAutor = parseInt(autorId);

      if (
        isNaN(id) ||
        isNaN(data.getTime()) ||
        isNaN(qtdTotal) ||
        isNaN(qtdDispo) ||
        isNaN(idAutor)
      ) {
        return "Erro: Formato é inválido. Favor verificar a data (AAAA-MM-DD) e os números digitados ";
      }

      await this.livroService.atualizar(id, {
        titulo,
        dataLancamento: data,
        quantidadeTotal: qtdTotal,
        quantidadeDisponivel: qtdDispo,
        autorId: idAutor,
      });

      return `O livro com o ID ${id} foi atualizado com sucesso!!`;
    } catch (error) {
      return `Erro ao atualizar o livro: ${(error as Error).message}`;
    }
  }
}
