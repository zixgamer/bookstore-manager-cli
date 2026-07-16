import { LivroRepository } from "../repositories/LivroRepository";
import { Livro } from "../models/Livro";
import { AutorService } from "./AutorService";
import { RegistroNaoEncontrado, DadosInvalidosError } from "../utils/errors";

export class LivroService {
  constructor(
    private livroRepository: LivroRepository,
    private autorService: AutorService,
  ) {}

  async criar(livro: Livro): Promise<Livro> {
    await this.validarRegrasDeNegocio(livro);
    return await this.livroRepository.criar(livro);
  }

  async atualizar(id: number, livro: Livro): Promise<Livro> {
    await this.buscarPorId(id);
    await this.validarRegrasDeNegocio(livro);

    const atualizado = await this.livroRepository.atualizar(id, livro);
    if (!atualizado) throw new Error("Erro ao atualizar livro.");
    return atualizado;
  }

  private async validarRegrasDeNegocio(livro: Livro): Promise<void> {
    if (!livro.titulo || livro.titulo.trim() === "") {
      throw new DadosInvalidosError("O titulo do livro não pode ser vazio.");
    }

    if (livro.quantidadeDisponivel > livro.quantidadeTotal) {
      throw new DadosInvalidosError(
        "A quantidade disponível não pode ser maior que a total.",
      );
    }

    await this.autorService.buscarPorId(livro.autorId);
  }

  async listarTodos(): Promise<Livro[]> {
    return await this.livroRepository.listarTodos();
  }

  async buscarPorId(id: number): Promise<Livro> {
    const livro = await this.livroRepository.buscarPorId(id);
    if (!livro) {
      throw new RegistroNaoEncontrado("Livro", id);
    }
    return livro;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    const livroRemovido = await this.livroRepository.remover(id);
    if (!livroRemovido) {
      throw new RegistroNaoEncontrado("Livro", id);
    }
  }
}
