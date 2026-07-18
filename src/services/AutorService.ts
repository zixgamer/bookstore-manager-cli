import { AutorRepository } from "../repositories/AutorRepository";
import { Autor } from "../models/Autor";
import {
  registroNaoEncontrado,
  dadosInvalidosError,
  regraDeNegocioError,
} from "../utils/errors";

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
      throw new registroNaoEncontrado("Autor", id);
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

    try {
      await this.autorRepository.remover(id);
    } catch (error: any) {
      // 23503 é o código padrão do PostgreSQL para violação de Foreign Key
      if (error.code === "23503" || error.message.includes("foreign key")) {
        throw new regraDeNegocioError(
          "Não é possível remover: este autor possui livros cadastrados.",
        );
      }
      throw error;
    }
  }

  private validarDadosAutor(autor: Autor): void {
    if (!autor.nome || autor.nome.trim() === "") {
      throw new dadosInvalidosError(
        "O nome do autor é obrigatório e não pode estar vazio.",
      );
    }
  }
}
