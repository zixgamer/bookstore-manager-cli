export interface Cliente {
  id?: number;
  nome: string;
  email: string;
}

export class ClienteImpl implements Cliente {
  constructor(
    public nome: string,
    public email: string,
    public id?: number,
  ) {}
}
