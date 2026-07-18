import { RelatorioService } from "../services/RelatorioService";

export class RelatorioController {
  constructor(private relatorioService: RelatorioService) {}

  async listarLivroDisponivel(): Promise<string> {
    try {
      const livros = await this.relatorioService.listarLivroDisponivel();
      if (livros.length === 0) return "Nenhum livro disponível no momento.";

      let tabela = "ID | Titulo | Disponivel | Total \n";
      tabela += livros
        .map(
          (d) =>
            `${d.id} | ${d.titulo} | ${d.quantidade_disponivel} | ${d.quantidade_total}`,
        )
        .join("\n");

      return tabela;
    } catch (error: any) {
      return `Houve um erro ao tentar gerar o relatório de livros disponíveis: ${error.message}`;
    }
  }

  async listarLivroEmprestado(): Promise<string> {
    try {
      const dados = await this.relatorioService.listarLivroEmprestado();
      if (dados.length === 0) return "Nenhum livro está emprestado no momento.";

      let tabela = "Livro | Cliente | Data de Emprestimo \n";
      tabela += dados
        .map((d) => {
          const dataFormatada = d.data_emprestimo
            ? new Date(d.data_emprestimo).toLocaleDateString("pt-BR")
            : "Data Indisponível";

          return `${d.titulo} | ${d.cliente_nome} | ${dataFormatada}`;
        })
        .join("\n");

      return tabela;
    } catch (error: any) {
      return `Houve um erro ao tentar gerar o relatório de empréstimos: ${error.message}`;
    }
  }

  async listarLivroPorAutor(): Promise<string> {
    try {
      const dados = await this.relatorioService.listarLivroPorAutor();
      if (dados.length === 0) return "Nenhum dado por autor foi encontrado.";

      let tabela = "Autor | Titulo | Quantidade Total \n";
      tabela += dados
        .map((d) => `${d.autor} | ${d.titulo} | ${d.quantidade_total}`)
        .join("\n");

      return tabela;
    } catch (error: any) {
      return `Houve um erro ao tentar gerar o relatório por autor: ${error.message}`;
    }
  }

  async contarEmprestimoPorLivro(): Promise<string> {
    try {
      // Correção: Chamando o método certo do Service!
      const dados = await this.relatorioService.totalEmprestimoPorLivro();
      if (dados.length === 0)
        return "Nenhum histórico de empréstimo encontrado.\n";

      let tabela = "ID | Titulo | Quantidade total de emprestimos \n";
      tabela += dados
        .map((d) => `${d.id} | ${d.titulo} | ${d.total_emprestimos}`)
        .join("\n");

      return tabela;
    } catch (error: any) {
      return `Houve um erro ao gerar o relatório de ranking de livros: ${error.message}`;
    }
  }

  async listarClienteComEmprestimoAtivo(): Promise<string> {
    try {
      const dados =
        await this.relatorioService.listarClienteComEmprestimoAtivo();
      if (dados.length === 0)
        return "Nenhum cliente com empréstimo ativo no momento.";

      let tabela = "ID | Cliente | Emprestimos Ativos\n";

      tabela += dados
        .map((d) => `${d.id} | ${d.nome} | ${d.emprestimos_ativos}`)
        .join("\n");

      return tabela;
    } catch (error: any) {
      return `Erro ao gerar o relatório de clientes ativos: ${error.message}`;
    }
  }
}
