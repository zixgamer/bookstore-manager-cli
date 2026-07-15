export interface Autor {
  id?: number | undefined;
  nome: string;
}

export class AutorImpl implements Autor {
  constructor(
    public nome: string,
    public id?: number,
  ) {}
}
