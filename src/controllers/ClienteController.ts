import { ClienteService } from "../services/ClienteService";
import { numeroObrigatorio } from "../utils/inputHelper";
import { emailJaCadastrado, dadosInvalidosError } from "../utils/errors";
import { Cliente } from "../models/Cliente";

export class ClienteController {
  constructor(private clienteService: ClienteService) {}

  async criar(nome: string, email: string): Promise<string> {
    try {
      const criarCliente = await this.clienteService.criar({ nome, email });
      return `O cliente ${criarCliente.nome} foi cadastrado com sucesso (seu ID: ${criarCliente.id})`;
    } catch (error) {
      if (
        error instanceof emailJaCadastrado ||
        error instanceof dadosInvalidosError
      ) {
        return `Erro encontrado: ${error.message}`;
      }
      return `Erro inesperado ocorreu: ${(error as Error).message}`;
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
      const buscaId = numeroObrigatorio(idRaw, "ID do Cliente");
      const cliente = await this.clienteService.buscarPorId(buscaId);
      return `Cliente encontrado: ${cliente.nome}, seu email: ${cliente.email}`;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }

  async atualizar(idRaw: string, nome: string, email: string): Promise<string> {
    try {
      const id = numeroObrigatorio(idRaw, "ID do Cliente");

      // Troca de 'any' por 'Partial<Cliente>' ativando o strict typing
      const atualizarId: Partial<Cliente> = {};
      if (nome.trim() !== "") atualizarId.nome = nome;
      if (email.trim() !== "") atualizarId.email = email;

      const clienteAtualizar = await this.clienteService.atualizar(
        id,
        atualizarId,
      );
      return `Cliente com ID ${clienteAtualizar.id} foi atualizado com sucesso`;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }

  async remover(idRaw: string): Promise<string> {
    try {
      const id = numeroObrigatorio(idRaw, "ID do Cliente");
      await this.clienteService.remover(id);
      return `O cliente foi removido com sucesso!`;
    } catch (error) {
      return `Erro: ${(error as Error).message}`;
    }
  }
}
