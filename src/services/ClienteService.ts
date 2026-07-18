import { ClienteRepository } from "../repositories/ClienteRepository";
import { Cliente } from "../models/Cliente";
import {
  registroNaoEncontrado,
  emailJaCadastrado,
  dadosInvalidosError,
  regraDeNegocioError,
} from "../utils/errors";

export class ClienteService {
  constructor(private clienteRepository: ClienteRepository) {}

  async criar(cliente: Cliente): Promise<Cliente> {
    this.validarDados(cliente.nome, cliente.email);

    const emailJaExiste = await this.clienteRepository.buscarPorEmail(
      cliente.email,
    );
    if (emailJaExiste) {
      throw new emailJaCadastrado(cliente.email);
    }

    return await this.clienteRepository.criar(cliente);
  }

  async listarTodos(): Promise<Cliente[]> {
    return await this.clienteRepository.listarTodos();
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) {
      throw new registroNaoEncontrado("Cliente", id);
    }
    return cliente;
  }

  async atualizar(
    id: number,
    clienteAtualizado: Partial<Cliente>,
  ): Promise<Cliente> {
    await this.buscarPorId(id);

    if (
      clienteAtualizado.nome !== undefined &&
      clienteAtualizado.nome?.trim().length === 0
    ) {
      throw new dadosInvalidosError("O nome não pode ser vazio.");
    }

    if (clienteAtualizado.email !== undefined) {
      this.validarFormatoEmail(clienteAtualizado.email);

      const emailJaExiste = await this.clienteRepository.buscarPorEmail(
        clienteAtualizado.email,
      );
      if (emailJaExiste && emailJaExiste.id !== id) {
        throw new emailJaCadastrado(clienteAtualizado.email);
      }
    }

    const atualizado = await this.clienteRepository.atualizar(
      id,
      clienteAtualizado,
    );
    return atualizado!;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    try {
      await this.clienteRepository.remover(id);
    } catch (error: any) {
      if (error.code === "23503" || error.message.includes("foreign key")) {
        throw new regraDeNegocioError(
          "Não é possível remover: este cliente possui empréstimos registrados no histórico.",
        );
      }
      throw error;
    }
  }

  private validarDados(nome: string, email: string): void {
    if (!nome || nome.trim().length === 0) {
      throw new dadosInvalidosError("O nome do cliente não pode estar vazio.");
    }
    this.validarFormatoEmail(email);
  }

  private validarFormatoEmail(email: string): void {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regexEmail.test(email)) {
      throw new dadosInvalidosError("O formato do email é inválido.");
    }
  }
}
