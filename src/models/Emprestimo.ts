export interface Emprestimo {
  id?: number;
  dataEmprestimo: Date;
  dataDevolucao?: Date;
  clienteId: number;
  livroId: number;
}

export class EmprestimoImpl implements Emprestimo {
  constructor(
    public dataEmprestimo: Date,
    public clienteId: number,
    public livroId: number,
    public id?: number,
    public dataDevolucao?: Date,
  ) {}
}
