export class registroNaoEncontrado extends Error {
  constructor(model: string, id: number) {
    super(`${model} com ID ${id} nao foi encontrado`);
    this.name = "RegistroNaoEncontradoError";
  }
}

export class livroIndisponivel extends Error {
  constructor(titulo: string) {
    super(`O livro "${titulo}" nao esta disponivel para emprestimo`);
    this.name = "LivroIndisponivelError";
  }
}

export class emailJaCadastrado extends Error {
  constructor(email: string) {
    super(`Ja existe um cliente cadastrado com email digitado ${email}`);
    this.name = "EmailJaCadastradoError";
  }
}

export class regraDeNegocioError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "RegraDeNegocioError";
  }
}

export class dadosInvalidosError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "DadosInvalidosError";
  }
}
