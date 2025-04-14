
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

type Props = {
  periodoSelecionado: string;
};

function PainelResumo({ periodoSelecionado }: Props) {
  const [total, setTotal] = useState(0);
  const [categorias, setCategorias] = useState(0);
  const [ultimaData, setUltimaData] = useState('');
  const [mediaPorDia, setMediaPorDia] = useState(0);

  const carregarResumo = async () => {
    let query = supabase.from('erros_processados').select('*');

    if (periodoSelecionado !== 'todos') {
      const dias = parseInt(periodoSelecionado);
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - dias);
      query = query.gte('criado_em', dataLimite.toISOString());
    }

    const { data, error } = await query;

    if (!error && data) {
      setTotal(data.length);

      const categoriasUnicas = new Set(data.map((item) => item.categoria));
      setCategorias(categoriasUnicas.size);

      const datas = data.map((item) => new Date(item.criado_em).getTime());
      const ultima = datas.length > 0 ? new Date(Math.max(...datas)).toLocaleString() : '';
      setUltimaData(ultima);

      if (periodoSelecionado !== 'todos') {
        const dias = parseInt(periodoSelecionado);
        setMediaPorDia((data.length / dias).toFixed(2));
      } else {
        setMediaPorDia(0);
      }
    }
  };

  useEffect(() => {
    carregarResumo();
  }, [periodoSelecionado]);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="text-center">
        <p className="text-gray-500">Total de Erros</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-500">Categorias Distintas</p>
        <p className="text-2xl font-bold">{categorias}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-500">Última Análise</p>
        <p className="text-lg">{ultimaData || '-'}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-500">Média por Dia</p>
        <p className="text-2xl font-bold">{mediaPorDia}</p>
      </div>
    </div>
  );
}

export default PainelResumo;
