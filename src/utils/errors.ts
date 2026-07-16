export class RegistroNaoEncontrado extends Error {
  constructor(model: string, id: number) {
    super(`${model} com ID ${id} nao foi encontrado`);
    this.name = "RegistroNaoEncontradoError";
  }
}

export class LivroIndiposnivel extends Error {
  constructor(titulo: string) {
    super(`O livroa "${titulo}" nao esta disponivel para emprestimo`);
    this.name = "LivroIndisponivelError";
  }
}

export class EmailJaCadastrado extends Error {
  constructor(email: string) {
    super(`Ja existe um cliente cadastrado com email digitado ${email}`);
    this.name = "EmailJaCadastradoError";
  }
}

export class DadosInvalidosError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "DadosInvalidosError";
  }
}
