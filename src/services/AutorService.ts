import { AutorRepository } from "../repositories/AutorRepository";
import { Autor } from "../models/Autor";
import { RegistroNaoEncontrado, DadosInvalidosError } from "../utils/errors";

export class AutorService {
  constructor(private autorRepository: AutorRepository) {}

  async criar(autor: Autor): Promise<Autor> {
    this.validarDadosAutor(autor);
    return await this.autorRepository.criar(autor);
  }

  async listarTodos(): Promise<Autor[]> {
    return await this.autorRepository.listarTodos();
  }

  async buscarPorId(id: number): Promise<Autor> {
    const autor = await this.autorRepository.buscarPorId(id);
    if (!autor) {
      throw new RegistroNaoEncontrado("Autor", id);
    }
    return autor;
  }

  async atualizar(id: number, autor: Autor): Promise<Autor> {
    await this.buscarPorId(id);
    this.validarDadosAutor(autor);

    const autorAtualizado = await this.autorRepository.atualizar(id, autor);
    if (!autorAtualizado) {
      throw new Error(`Falha inesperada ao atualizar autor com ID ${id}.`);
    }
    return autorAtualizado;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    const jaRemovido = await this.autorRepository.remover(id);
    if (!jaRemovido) {
      throw new RegistroNaoEncontrado("Autor", id);
    }
  }

  private validarDadosAutor(autor: Autor): void {
    if (!autor.nome || autor.nome.trim() === "") {
      throw new DadosInvalidosError(
        "O nome do autor é obrigatório e não pode estar vazio.",
      );
    }
  }
}
