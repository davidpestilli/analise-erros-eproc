// supabase/functions/analisar_erro/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { nome_arquivo, trecho } = await req.json();

  if (!trecho || !nome_arquivo) {
    return new Response(JSON.stringify({ error: 'Dados incompletos' }), { status: 400 });
  }

  // Chamada à API da DeepSeek
  const respostaIA = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'Você é um analista de erros do sistema eproc. Abaixo está um log de erro de uma tentativa de distribuição processual. Seu trabalho é:\n\n1. Identificar a causa principal da falha\n2. Atribuir uma categoria curta para o erro (ex: "parte ausente", "juízo inexistente", "competência inválida")\n3. Sugerir uma solução prática\n\nResponda no seguinte formato JSON:\n{\n  "categoria": "<categoria_do_erro>",\n  "causa": "<resumo_da_causa>",\n  "solucao": "<sugestao_de_correcao>"\n}'
        },
        {
          role: 'user',
          content: trecho
        }
      ]
    })
  });

  const { choices } = await respostaIA.json();
  let resultado;

  try {
    resultado = JSON.parse(choices?.[0]?.message?.content || '{}');
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Erro ao interpretar resposta da IA' }), { status: 500 });
  }

  // Inserção no banco
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  );

  const { error } = await supabaseClient.from('erros_processados').insert({
    nome_arquivo,
    categoria: resultado.categoria,
    causa: resultado.causa,
    solucao: resultado.solucao
  });

  if (error) {
    return new Response(JSON.stringify({ error: 'Erro ao salvar no banco' }), { status: 500 });
  }

  return new Response(JSON.stringify(resultado), { status: 200 });
});

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
