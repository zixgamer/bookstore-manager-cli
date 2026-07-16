import { AutorService } from "../services/AutorService";
import { NumeroObrigatorio } from "../utils/inputHelper";

export class AutorController {
  constructor(private autorService: AutorService) {}

  async criar(nomeRaw: string): Promise<string> {
    try {
      const novoAutor = await this.autorService.criar({ nome: nomeRaw });
      return `Autor: ${novoAutor.id} | Nome: ${novoAutor.nome} foi cadastrado com sucesso!! `;
    } catch (error) {
      return `Erro ao criar autor: ${(error as Error).message}`;
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
    try {
      const id = NumeroObrigatorio(idRaw, "ID do Autor");
      const autor = await this.autorService.buscarPorId(id);
      return `Autor foi encontrado: ID:${autor.id}, Nome:${autor.nome}`;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }

  async atualizar(idRaw: string, nomeRaw: string): Promise<string> {
    try {
      const id = NumeroObrigatorio(idRaw, "ID do Autor");
      const autorAtualizado = await this.autorService.atualizar(id, {
        nome: nomeRaw,
      });

      return `Autor atualizado com sucesso: ID:${autorAtualizado.id} | Nome:${autorAtualizado.nome}`;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }

  async remover(idRaw: string): Promise<string> {
    try {
      const id = NumeroObrigatorio(idRaw, "ID do Autor");
      await this.autorService.remover(id);
      return `Autor com o ID ${id} foi removido com sucesso do sistema.`;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }
}
