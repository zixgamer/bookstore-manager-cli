import { dadosInvalidosError } from "./errors";

export function numeroObrigatorio(valor: string, nomeCampo: string): number {
  const numero = Number(valor);
  if (valor.trim() === "" || isNaN(numero)) {
    throw new dadosInvalidosError(
      `Os dados inseridos no ${nomeCampo} são inválidos`,
    );
  }
  return numero;
}

export function dataObrigatoria(valor: string, nomeCampo: string): Date {
  const data = new Date(valor);
  if (isNaN(data.getTime())) {
    throw new dadosInvalidosError(
      `Os dados inseridos no ${nomeCampo} são inválidos`,
    );
  }
  return data;
}
