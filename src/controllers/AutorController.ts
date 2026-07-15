import { AutorService } from "../services/AutorService";

export class AutorController {
  constructor(private autorService: AutorService) {}

  async criar(nomeRaw: string): Promise<string> {
    try {
      const novoAutor = await this.autorService.criar({ nome: nomeRaw });
      return `Autor: ${novoAutor.id} | Nome: ${novoAutor.nome} foi cadastrado com sucesso!! `;
    } catch (error) {
      return `Erro ao criar autor:${(error as Error).message}`;
    }
  }

  async listarTodos(): Promise<string> {
    try {
      const autores = await this.autorService.listarTodos();

      if (autores.length === 0) {
        return `Nenhum autor cadastrado no sistema`;
      }

      let tabela = "====================================\n";
      tabela += "         LISTA DE AUTORES           \n";
      tabela += "====================================\n";
      tabela += "ID| Nome\n";
      tabela += "------------------------------------\n";

      autores.forEach((autor) => {
        tabela += `${autor.id}| ${autor.nome}\n`;
      });

      tabela += "===================================";
      return tabela;
    } catch (error) {
      return `Erro ao listar os autores: ${(error as Error).message}`;
    }
  }

  async buscarPorId(idRaw: string): Promise<string> {
    const id = Number(idRaw);
    if (isNaN(id) || idRaw.trim() === "") {
      return `Erro de formato: O ID que foi fornecido deve ser um número válido`;
    }
    try {
      const autor = await this.autorService.buscarPorId(id);
      return `Autor foi encontrado: ID:${autor.id}, Nome:${autor.nome}`;
    } catch (error) {
      return `Erro: Não foi possivel encontrar este ID ${(error as Error).message}`;
    }
  }

  async atualizar(idRaw: string, nomeRaw: string): Promise<string> {
    const id = Number(idRaw);
    if (isNaN(id) || idRaw.trim() === "") {
      return `Erro ao atualizar autor: o ID fornecido deve ser um númro de autor válido`;
    }

    try {
      const autorAtualizado = await this.autorService.atualizar(id, {
        nome: nomeRaw,
      });

      return `Autor atualizado com sucesso: ID:${autorAtualizado.id} | Nome:${autorAtualizado.nome}`;
    } catch (error) {
      return `Erro:Não foi possivel atualizar o autor: ${(error as Error).message}`;
    }
  }

  async remover(idRaw: string): Promise<string> {
    const id = Number(idRaw);
    if (isNaN(id) || idRaw.trim() === "") {
      return `Erro ao tentar remover ID de autor fornecido, verificar se o ID fornecido é valido. `;
    }

    try {
      await this.autorService.remover(id);
      return `Autor com o ID ${id} foi removido com sucesso do sistema.`;
    } catch (error) {
      return `Erro: Não foi possivel remover este ID ${(error as Error).message}`;
    }
  }
}
