export function NumeroObrigatorio(valor: string, nomeCampo: string): number {
  const numero = Number(valor);
  if (valor.trim() === "" || isNaN(numero)) {
    throw new Error(`Erro de formato: ${nomeCampo} deve ser um número válido.`);
  }
  return numero;
}

export function DataObrigatoria(valor: string, nomeCampo: string): Date {
  const data = new Date(valor);
  if (isNaN(data.getTime())) {
    throw new Error(
      `Erro de formato: ${nomeCampo} deve estar em um formato de data válido (AAAA-MM-DD).`,
    );
  }
  return data;
}
