import { EmprestimoService } from "../services/EmprestimoService";
import { NumeroObrigatorio } from "../utils/inputHelper";
import { RegistroNaoEncontrado, LivroIndiposnivel } from "../utils/errors";

export class EmprestimoController {
  constructor(private emprestimoService: EmprestimoService) {}

  async fazerEmprestimo(
    clienteIdRaw: string,
    livroIdRaw: string,
  ): Promise<string> {
    try {
      const clienteId = NumeroObrigatorio(clienteIdRaw, "ID do Cliente");
      const livroId = NumeroObrigatorio(livroIdRaw, "ID do Livro");

      const emprestimo = await this.emprestimoService.criar(clienteId, livroId);
      return `✅ O empréstimo foi realizado com sucesso! ID do seu empréstimo: ${emprestimo.id}`;
    } catch (error) {
      if (
        error instanceof RegistroNaoEncontrado ||
        error instanceof LivroIndiposnivel
      ) {
        return `Erro de Regra: ${error.message}`;
      }
      return `Erro inesperado: ${(error as Error).message}`;
    }
  }

  async devolver(idRaw: string): Promise<string> {
    try {
      const id = NumeroObrigatorio(idRaw, "ID do Empréstimo");

      await this.emprestimoService.registrarDevolucao(id);
      return "A devolução do livro foi registrada com sucesso! Estoque atualizado.";
    } catch (error: any) {
      return `Erro: ${error.message}`;
    }
  }

  async listarEmprestimo(): Promise<string> {
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
