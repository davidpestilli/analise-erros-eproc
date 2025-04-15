import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    const { nome_arquivo, trecho } = await req.json()

    const respostaIA = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk-30ead5f469544586866d18fe075cd694', // substitua aqui
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              'Você é um analista de erros do sistema eproc. Abaixo está um log de erro de uma tentativa de distribuição processual. Identifique a categoria, causa e solução em JSON.',
          },
          { role: 'user', content: trecho },
        ],
        stream: false,
      }),
    })

    if (!respostaIA.ok) {
      const erroTexto = await respostaIA.text()
      console.log('Erro da DeepSeek:', erroTexto)
      return new Response(JSON.stringify({ erro: 'DeepSeek falhou', detalhe: erroTexto }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const resposta = await respostaIA.json()
    console.log('Resposta completa da IA:', resposta)

    const conteudo = resposta.choices?.[0]?.message?.content || ''

    // 🔍 Parsing do conteúdo JSON vindo como string dentro de markdown
    const jsonLimpo = conteudo.replace(/```json\n?|```/g, '').trim()

    let categoria = '-'
    let causa = '-'
    let solucao = '-'

    try {
      const jsonExtraido = JSON.parse(jsonLimpo)

      categoria = jsonExtraido.categoria || '-'
      causa = jsonExtraido.causa || '-'

      if (Array.isArray(jsonExtraido.solucao)) {
        solucao = jsonExtraido.solucao.join(' | ')
      } else {
        solucao = jsonExtraido.solucao || '-'
      }
    } catch (e) {
      console.log('Erro ao fazer parse do JSON da IA:', e)
    }

    const { error } = await supabase.from('erros_processados').insert([
      {
        nome_arquivo,
        categoria,
        causa,
        solucao,
        criado_em: new Date().toISOString(),
      },
    ])

    if (error) {
      console.log('Erro ao inserir no Supabase:', error.message)
    }

    return new Response(JSON.stringify({ status: 'sucesso', categoria, causa, solucao }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    console.log('Erro geral:', e)

    return new Response(JSON.stringify({ erro: 'Falha na função', detalhe: String(e) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
})
