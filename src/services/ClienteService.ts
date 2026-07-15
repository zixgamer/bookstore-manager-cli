import { ClienteRepository } from "../repositories/ClienteRepository";
import { Cliente } from "../models/Cliente";

export class EmailJaCadastrado extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailJaCadastrado";
  }
}

export class ClienteNaoEncontrado extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClienteNaoEncontrado";
  }
}

export class DadosInvalidos extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DadosInvalidos";
  }
}

export class ClienteService {
  constructor(private clienteRepository: ClienteRepository) {}

  async criar(cliente: Cliente): Promise<Cliente> {
    this.validarDados(cliente.nome, cliente.email);

    const emailJaExiste = await this.clienteRepository.buscarPorEmail(
      cliente.email,
    );
    if (emailJaExiste) {
      throw new EmailJaCadastrado(
        `O email ${cliente.email} já está cadastrado em nosso sistema`,
      );
    }

    return await this.clienteRepository.criar(cliente);
  }

  async listarTodos(): Promise<Cliente[]> {
    return await this.clienteRepository.listarTodos();
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) {
      throw new ClienteNaoEncontrado(
        `O cliente com o ID ${id} não foi encontrado em nosso sistema`,
      );
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
      throw new DadosInvalidos("O nome não pode ser vazio");
    }

    if (clienteAtualizado.email !== undefined) {
      this.validarFormatoEmail(clienteAtualizado.email);

      const emailJaExiste = await this.clienteRepository.buscarPorEmail(
        clienteAtualizado.email,
      );
      if (emailJaExiste && emailJaExiste.id !== id) {
        throw new EmailJaCadastrado(
          `O email ${clienteAtualizado.email} já está em uso por outro cliente`,
        );
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

    await this.clienteRepository.remover(id);
  }

  private validarDados(nome: string, email: string): void {
    if (!nome || nome.trim().length === 0) {
      throw new DadosInvalidos("O nome do cliente não pode estar vazio");
    }
    this.validarFormatoEmail(email);
  }
  private validarFormatoEmail(email: string): void {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regexEmail.test(email)) {
      throw new DadosInvalidos("O formato do email é inválido");
    }
  }
}
