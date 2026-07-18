import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { EmprestimoImpl } from "../models/Emprestimo";
import {
  registroNaoEncontrado,
  livroIndisponivel,
  dadosInvalidosError,
} from "../utils/errors";

export class EmprestimoService {
  constructor(
    private emprestimoRepo: EmprestimoRepository,
    private livroRepo: LivroRepository,
    private clienteRepo: ClienteRepository,
  ) {}

  async criar(clienteId: number, livroId: number): Promise<EmprestimoImpl> {
    const cliente = await this.clienteRepo.buscarPorId(clienteId);
    if (!cliente) {
      throw new registroNaoEncontrado("Cliente", clienteId);
    }

    const livro = await this.livroRepo.buscarPorId(livroId);
    if (!livro) {
      throw new registroNaoEncontrado("Livro", livroId);
    }

    if (!livro.estaDisponivel()) {
      throw new livroIndisponivel(livro.titulo);
    }

    await this.livroRepo.atualizarEstoque(
      livroId,
      livro.quantidadeDisponivel - 1,
    );

    const novoEmprestimo = new EmprestimoImpl(new Date(), clienteId, livroId);
    return await this.emprestimoRepo.criar(novoEmprestimo);
  }

  async registrarDevolucao(id: number): Promise<void> {
    const emprestimo = await this.emprestimoRepo.buscarPorId(id);
    if (!emprestimo) {
      throw new registroNaoEncontrado("Empréstimo", id);
    }

    if (emprestimo.dataDevolucao) {
      throw new dadosInvalidosError("Este livro já foi devolvido.");
    }

    await this.emprestimoRepo.registrarDevolucao(id);
    const livro = await this.livroRepo.buscarPorId(emprestimo.livroId);

    if (livro) {
      await this.livroRepo.atualizarEstoque(
        livro.id!,
        livro.quantidadeDisponivel + 1,
      );
    } else {
      throw new registroNaoEncontrado(
        "Livro (vinculado ao empréstimo)",
        emprestimo.livroId,
      );
    }
  }

  async listarEmprestimo(): Promise<any[]> {
    return await this.emprestimoRepo.listarCompleto();
  }
}
