import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { EmprestimoImpl } from "../models/Emprestimo";
import {
  RegistroNaoEncontrado,
  LivroIndiposnivel,
  DadosInvalidosError,
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
      throw new RegistroNaoEncontrado("Cliente", clienteId);
    }

    const livro: any = await this.livroRepo.buscarPorId(livroId);
    if (!livro) {
      throw new RegistroNaoEncontrado("Livro", livroId);
    }

    if (!livro.estaDisponivel()) {
      throw new LivroIndiposnivel(livro.titulo);
    }

    await this.livroRepo.atualizarEstoque(
      livroId,
      livro.quantidadeDisponivel - 1,
    );

    try {
      const novoEmprestimo = new EmprestimoImpl(new Date(), clienteId, livroId);
      return await this.emprestimoRepo.criar(novoEmprestimo);
    } catch (error) {
      throw error;
    }
  }

  async registrarDevolucao(id: number): Promise<void> {
    const emprestimo = await this.emprestimoRepo.buscarPorId(id);
    if (!emprestimo) {
      throw new RegistroNaoEncontrado("Empréstimo", id);
    }

    if (emprestimo.dataDevolucao) {
      throw new DadosInvalidosError("Este livro já foi devolvido.");
    }

    await this.emprestimoRepo.registroDevolucao(id);
    const livro = await this.livroRepo.buscarPorId(emprestimo.livroId);

    if (livro) {
      await this.livroRepo.atualizarEstoque(
        livro.id!,
        livro.quantidadeDisponivel + 1,
      );
    } else {
      throw new RegistroNaoEncontrado(
        "Livro (vinculado ao empréstimo)",
        emprestimo.livroId,
      );
    }
  }

  async listarEmprestimo(): Promise<any[]> {
    return await this.emprestimoRepo.listarCompleto();
  }
}
