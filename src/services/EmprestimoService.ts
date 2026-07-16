import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { EmprestimoImpl } from "../models/Emprestimo";
import { error } from "node:console";

export class ClienteNaoEncontrado extends Error {
  name = "ClienteNaoEncontrado";
}
export class LivroNaoEncontrado extends Error {
  name = "LivroNaoEncontrado";
}
export class LivroIndisponivel extends Error {
  name = "LivroIndisponivel";
}

export class EmprestimoService {
  constructor(
    private emprestimoRepo: EmprestimoRepository,
    private livroRepo: LivroRepository,
    private clienteRepo: ClienteRepository,
  ) {}

  async criar(clienteId: number, livroId: number): Promise<EmprestimoImpl> {
    const cliente = await this.clienteRepo.buscarPorId(clienteId);
    if (!cliente) {
      throw new ClienteNaoEncontrado(
        `Cliente com o ID ${clienteId} nao foi encontrado`,
      );
    }

    const livro = await this.livroRepo.buscarPorId(livroId);
    if (!livro) {
      throw new LivroNaoEncontrado(
        `O livro com o ID ${livroId} nao foi encontrado`,
      );
    }

    if (livro.quantidadeDisponivel <= 0) {
      throw new LivroIndisponivel(
        `O livro ${livro.titulo} nao esta disponivel no momento`,
      );
    }

    const novoEmprestimo = new EmprestimoImpl(new Date(), clienteId, livroId);
    const emprestimoCriado = await this.emprestimoRepo.criar(novoEmprestimo);

    await this.livroRepo.atualizar(livroId, {
      ...livro,
      quantidadeDisponivel: livro.quantidadeDisponivel - 1,
    });
    return emprestimoCriado;
  }
}
