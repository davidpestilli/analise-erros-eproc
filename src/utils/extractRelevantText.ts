export function extractRelevantText(emlContent: string): string {
  const linhas = emlContent.split('\n');

  const blocosRelevantes: string[] = [];
  let blocoAtual: string[] = [];
  let capturando = false;

  for (const linha of linhas) {
    const linhaLower = linha.toLowerCase();

    if (
      linhaLower.includes('exception') ||
      linhaLower.includes('erro') ||
      linhaLower.includes('error') ||
      linhaLower.includes('trace') ||
      linhaLower.includes('stack')
    ) {
      capturando = true;
    }

    if (capturando) {
      blocoAtual.push(linha);

      // Se a linha for muito curta ou vazia, considera fim do bloco
      if (linha.trim() === '' || linha.length < 5) {
        if (blocoAtual.length > 0) {
          blocosRelevantes.push(blocoAtual.join('\n'));
          blocoAtual = [];
        }
        capturando = false;
      }
    }
  }

  // Adiciona o último bloco caso tenha ficado pendente
  if (blocoAtual.length > 0) {
    blocosRelevantes.push(blocoAtual.join('\n'));
  }

  // Junta os blocos com separador
  return blocosRelevantes.join('\n\n---\n\n');
}
