export interface Livro {
  id?: number;
  titulo: string;
  dataLancamento: Date;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
  autorId: number;
}

export class LivroImpl implements Livro {
  constructor(
    public titulo: string,
    public dataLancamento: Date,
    public quantidadeTotal: number,
    public quantidadeDisponivel: number,
    public autorId: number,
    public id?: number,
  ) {}

  estaDisponivel(): boolean {
    return this.quantidadeDisponivel > 0;
  }
}
