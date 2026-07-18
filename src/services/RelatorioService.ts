import { RelatorioRepository } from "../repositories/RelatorioRepository";

export class RelatorioService {
  constructor(private relatorioRepo: RelatorioRepository) {}

  async listarLivroDisponivel(): Promise<any[]> {
    return await this.relatorioRepo.listarLivroDisponivel();
  }

  async listarLivroEmprestado(): Promise<any[]> {
    return await this.relatorioRepo.listarLivroEmprestado();
  }

  async listarLivroPorAutor(): Promise<any[]> {
    return await this.relatorioRepo.listarLivroPorAutor();
  }

  async totalEmprestimoPorLivro(): Promise<any[]> {
    return await this.relatorioRepo.totalEmprestimoPorLivro();
  }

  async listarClienteComEmprestimoAtivo(): Promise<any[]> {
    return await this.relatorioRepo.listarClienteComEmprestimoAtivo();
  }
}
