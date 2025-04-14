
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

type ErroProcessado = {
  id: string;
  nome_arquivo: string;
  categoria: string;
  causa: string;
  solucao: string;
  criado_em: string;
};

type Props = {
  periodoSelecionado: string;
};

function ResultTable({ periodoSelecionado }: Props) {
  const [resultados, setResultados] = useState<ErroProcessado[]>([]);
  const [carregando, setCarregando] = useState(false);

  const carregarResultados = async () => {
    setCarregando(true);
    let query = supabase
      .from('erros_processados')
      .select('*')
      .order('criado_em', { ascending: false });

    if (periodoSelecionado !== 'todos') {
      const dias = parseInt(periodoSelecionado);
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - dias);
      query = query.gte('criado_em', dataLimite.toISOString());
    }

    const { data, error } = await query;

    if (!error && data) {
      setResultados(data as ErroProcessado[]);
    }

    setCarregando(false);
  };

  useEffect(() => {
    carregarResultados();
  }, [periodoSelecionado]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Resultados da Análise</h2>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Arquivo</th>
                <th className="px-4 py-2 border">Categoria</th>
                <th className="px-4 py-2 border">Causa</th>
                <th className="px-4 py-2 border">Solução</th>
                <th className="px-4 py-2 border">Data</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border">{item.nome_arquivo}</td>
                  <td className="px-4 py-2 border font-semibold">{item.categoria}</td>
                  <td className="px-4 py-2 border">{item.causa}</td>
                  <td className="px-4 py-2 border">{item.solucao}</td>
                  <td className="px-4 py-2 border">{new Date(item.criado_em).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResultTable;
