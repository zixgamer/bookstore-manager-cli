import { AutorRepository } from "../repositories/AutorRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { Livro, LivroImpl } from "../models/Livro";
import { AutorService } from "./AutorService";

export class LivroService {
  constructor(
    private livroRepository: LivroRepository,
    private autoService: AutorService,
  ) {}

  async criar(livro: Livro): Promise<Livro> {
    await this.validarRegrasDeNegocio(livro);
    return await this.livroRepository.criar(livro);
  }

  async atualizar(id: number, livro: Livro): Promise<Livro> {
    const livroExistente = await this.livroRepository.buscarPorId(id);
    if (!livroExistente) {
      throw new Error(
        `O livro com o ID ${id} não foi encontrado para atualizar`,
      );
    }

    await this.validarRegrasDeNegocio(livro);
    const atualizado = await this.livroRepository.atualizar(id, livro);

    if (!atualizado) throw new Error("Erro ao atualizar livro.");
    return atualizado;
  }

  private async validarRegrasDeNegocio(livro: Livro): Promise<void> {
    if (!livro.titulo || livro.titulo.trim() === "") {
      throw new Error("O titulo do livro não pode ser vazio");
    }

    if (livro.quantidadeDisponivel > livro.quantidadeTotal) {
      throw new Error(
        "A quantidade disponivel não pode ser maior que a total.",
      );
    }

    const autor = await this.autoService.buscarPorId(livro.autorId);
    if (!autor) {
      throw new Error(
        `O Autor com ID ${livro.autorId} não foi encontrado no nosso sistema.`,
      );
    }
  }

  async listarTodos(): Promise<Livro[]> {
    return await this.livroRepository.listarTodos();
  }

  async buscarPorId(id: number): Promise<Livro> {
    const livro = await this.livroRepository.buscarPorId(id);
    if (!livro) {
      throw new Error(
        `O livro com o ID ${id} não foi encontrado no nosso sistema`,
      );
    }
    return livro;
  }

  async remover(id: number): Promise<void> {
    const livroExiste = await this.livroRepository.remover(id);
    if (!livroExiste) {
      throw new Error(
        `Não foi possivel remover o livro com ID ${id}, não foi encontrado este livro em nosso sistema `,
      );
    }
  }
}
