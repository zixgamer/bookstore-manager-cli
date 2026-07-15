import {
  ClienteService,
  EmailJaCadastrado,
  ClienteNaoEncontrado,
  DadosInvalidos,
} from "../services/ClienteService";

export class ClienteController {
  constructor(private clienteService: ClienteService) {}

  async criar(nome: string, email: string): Promise<string> {
    try {
      const criarCliente = await this.clienteService.criar({ nome, email });
      return `O cliente ${criarCliente.nome} foi cadastrado com sucesso (seu ID: ${criarCliente.id})`;
    } catch (error) {
      if (
        error instanceof EmailJaCadastrado ||
        error instanceof DadosInvalidos
      ) {
        return `Erro encontrado! ${error.message}`;
      }
      return `Erro inesperado ocorreu ${(error as Error).message}`;
    }
  }

  async listarTodos(): Promise<string> {
    try {
      const listarClientes = await this.clienteService.listarTodos();
      if (listarClientes.length === 0)
        return `Nenhum cliente foi cadastrado até o momento`;

      return listarClientes
        .map((c) => `ID: ${c.id} | Nome: ${c.nome} | Email: ${c.email}`)
        .join("\n");
    } catch (error) {
      return `Erro ao tentar listar: ${(error as Error).message}`;
    }
  }

  async buscarPorId(idRaw: string): Promise<string> {
    try {
      const buscaId = parseInt(idRaw);
      if (isNaN(buscaId)) return "Erro! o ID é inválido";

      const cliente = await this.clienteService.buscarPorId(buscaId);
      return `O cliente encontrado: ${cliente.nome}, seu email: ${cliente.email}`;
    } catch (error) {
      if (error instanceof ClienteNaoEncontrado) {
        return `${error.message}`;
      }
      return `Erro inesperado: ${(error as Error).message}`;
    }
  }

  async atualizar(idRaw: string, nome: string, email: string): Promise<string> {
    try {
      const id = parseInt(idRaw);
      if (isNaN(id)) return `Erro: ID indicado é inválido`;

      const atualizarId: any = {};
      if (nome.trim() !== "") atualizarId.nome = nome;
      if (email.trim() !== "") atualizarId.email = email;

      const clienteAtualizar = await this.clienteService.atualizar(
        id,
        atualizarId,
      );
      return `Cliente com ID ${clienteAtualizar.id} foi atualizado com sucesso`;
    } catch (error) {
      if (
        error instanceof ClienteNaoEncontrado ||
        error instanceof EmailJaCadastrado ||
        error instanceof DadosInvalidos
      ) {
        return `Erro encontrado ${error.message}`;
      }
      return `Erro inesperado: ${(error as Error).message}`;
    }
  }

  async remover(idRaw: string): Promise<string> {
    try {
      const id = parseInt(idRaw);
      if (isNaN(id)) return `Erro: ID indicado é inválido`;

      await this.clienteService.remover(id);
      return `O cliente foi removido com sucesso!`;
    } catch (error) {
      if (error instanceof ClienteNaoEncontrado) {
        return `${error.message}`;
      }
      return `Erro inesperado: ${(error as Error).message}`;
    }
  }
}
