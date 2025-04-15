export async function enviarParaAnalise(nomeArquivo: string, trecho: string) {
  try {
    const response = await fetch(
      'https://rdkvvigjmowtvhxqlrnp.functions.supabase.co/analisar_erro',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_arquivo: nomeArquivo, trecho }),
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(`Erro do servidor: ${erro}`);
    }

    const json = await response.json();
    return json;
  } catch (erro) {
    console.error('Erro ao enviar para análise:', erro);
    throw erro;
  }
}
