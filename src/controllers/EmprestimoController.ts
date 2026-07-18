import { EmprestimoService } from "../services/EmprestimoService";
import { numeroObrigatorio } from "../utils/inputHelper";
import { registroNaoEncontrado, livroIndisponivel } from "../utils/errors";

export class EmprestimoController {
  constructor(private emprestimoService: EmprestimoService) {}

  async criar(clienteIdRaw: string, livroIdRaw: string): Promise<string> {
    try {
      const clienteId = numeroObrigatorio(clienteIdRaw, "ID do Cliente");
      const livroId = numeroObrigatorio(livroIdRaw, "ID do Livro");

      const emprestimo = await this.emprestimoService.criar(clienteId, livroId);
      return `O empréstimo foi realizado com sucesso! ID do seu empréstimo: ${emprestimo.id}`;
    } catch (error) {
      if (
        error instanceof registroNaoEncontrado ||
        error instanceof livroIndisponivel
      ) {
        return `Erro de Regra: ${error.message}`;
      }
      return `Erro inesperado: ${(error as Error).message}`;
    }
  }

  async devolver(idRaw: string): Promise<string> {
    try {
      const id = numeroObrigatorio(idRaw, "ID do Empréstimo");

      await this.emprestimoService.registrarDevolucao(id);
      return "A devolução do livro foi registrada com sucesso! Estoque atualizado.";
    } catch (error: any) {
      return `Erro: ${error.message}`;
    }
  }

  async listarTodos(): Promise<string> {
    try {
      const lista = await this.emprestimoService.listarEmprestimo();
      if (lista.length === 0)
        return "Nenhum empréstimo registrado até o momento.";

      return lista
        .map(
          (e) =>
            `ID: ${e.id} | Cliente: ${e.cliente_nome} | Livro: ${e.livro_titulo} | Empréstimo: ${e.data_emprestimo.toLocaleDateString()} | ` +
            `Devolvido: ${e.data_devolucao ? e.data_devolucao.toLocaleDateString() : "Não"}`,
        )
        .join("\n");
    } catch (error: any) {
      return `Erro ao listar: ${error.message}`;
    }
  }
}
