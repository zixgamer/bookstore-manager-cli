export interface Livro {
  id?: number;
  titulo: string;
  dataLancamento: Date;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
  autorid: number;
  estaDisponivel(): boolean;
}

export class LivroImpl implements Livro {
  constructor(
    public titulo: string,
    public dataLancamento: Date,
    public quantidadeTotal: number,
    public quantidadeDisponivel: number,
    public autorid: number,
    public id?: number,
  ) {}

  estaDisponivel(): boolean {
    return this.quantidadeDisponivel > 0;
  }
}
