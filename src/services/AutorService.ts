import { AutorRepository } from "../repositories/AutorRepository";
import { Autor, AutorImpl } from "../models/Autor";

export class AutorService {
  constructor(private autorRepository: AutorRepository) {}

  async criar(autor: Autor): Promise<Autor> {
    this.validarDadosAutor(autor);

    try {
      return await this.autorRepository.criar(autor);
    } catch (error) {
      throw new Error(`Erro ao criar autor: ${error}`);
    }
  }

  async listarTodos(): Promise<Autor[]> {
    try {
      return await this.autorRepository.listarTodos();
    } catch (error) {
      throw new Error(`Erro ao listar autores: ${error}`);
    }
  }

  async buscarPorId(id: number): Promise<Autor> {
    const autor = await this.autorRepository.buscarPorId(id);
    if (!autor) {
      throw new Error(`Autor com ID ${id} não foi encontrado no sistema.`);
    }
    return autor;
  }

  async atualizar(id: number, autor: Autor): Promise<Autor> {
    const atualizado = await this.autorRepository.atualizar(id, autor);
    await this.buscarPorId(id);

    try {
      const autorAtualizado = await this.autorRepository.atualizar(id, autor);
      if (!autorAtualizado) {
        throw new Error(`Falha inesperada ao atualizar autor com ID ${id}.`);
      }
      return autorAtualizado;
    } catch (error) {
      throw new Error(`Erro ao atualizar autor: ${error}`);
    }
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    try {
      const jaRemovido = await this.autorRepository.remover(id);
      if (!jaRemovido) {
        throw new Error(`Autor com ID ${id} não foi encontrado.`);
      }
    } catch (error) {
      throw new Error(
        `Erro ao remover o autor com ID ${id}. Verifique se este autor possui livros vinculados a ele. Detalhes de falha: ${error}`,
      );
    }
  }

  private validarDadosAutor(autor: Autor): void {
    if (!autor.nome || autor.nome.trim() === "") {
      throw new Error(
        "Validação de dados falhou: O nome do autor é obrigatório e não pode estar vazio.",
      );
    }
  }
}
