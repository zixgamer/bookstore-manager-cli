import {
  EmprestimoService,
  ClienteNaoEncontrado,
  LivroIndisponivel,
  LivroNaoEncontrado,
} from "../services/EmprestimoService";

export class EmprestimoController {
  constructor(private emprestimoService: EmprestimoService) {}

  async fazerEmprestimo(
    clienteIdRaw: string,
    livroIdRaw: string,
  ): Promise<string> {
    try {
      const clienteId = parseInt(clienteIdRaw);
      const livroId = parseInt(livroIdRaw);

      if (isNaN(clienteId) || isNaN(livroId)) {
        return `Erro: O ID do cliente e do livro digitados devem ser numeros validos`;
      }

      const emprestimo = await this.emprestimoService.criar(clienteId, livroId);
      return `O emprestimo foi realizado com sucesso! ID do seu emprestimo: ${emprestimo.id}`;
    } catch (error) {
      if (
        error instanceof ClienteNaoEncontrado ||
        error instanceof LivroNaoEncontrado ||
        error instanceof LivroIndisponivel
      ) {
        return `Erro: ${error.message}`;
      }

      return `Erro inesperado!! ${(error as Error).message}`;
    }
  }

  async devolver(idRaw: string): Promise<string> {
    try {
      const id = parseInt(idRaw);
      if (isNaN(id)) return "Erro: o ID e invalido";

      await this.emprestimoService.registrarDevolucao(id);
      return "A devolucao do livro foi registrada com uscesso! Estoque foi atualizado.";
    } catch (error: any) {
      return `Erro: ${error.message}`;
    }
  }

  async listarEmprestimo(): Promise<string> {
    const lista = await this.emprestimoService.listarEmprestimo();
    if (lista.length === 0) return "Nenhum emprestimo registrado ate o momento";

    return lista
      .map(
        (e) =>
          `ID: ${e.id} | Cliente: ${e.cliente_nome} | Livro: ${e.livro_titulo} | Emprestimo: ${e.data_emprestimo.toLocalDateString()} | ` +
          `Devolvido: ${e.data_devolucao ? e.data_devolucao.toLocalDateString() : "Nao"}`,
      )
      .join("\n");
  }
}
