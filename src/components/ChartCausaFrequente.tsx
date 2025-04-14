
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#b36bff', '#ff6666'];

type CategoriaContagem = {
  name: string;
  value: number;
};

type Props = {
  periodoSelecionado: string;
};

function ChartCausaFrequente({ periodoSelecionado }: Props) {
  const [dados, setDados] = useState<CategoriaContagem[]>([]);

  const carregarDados = async () => {
    let query = supabase.from('erros_processados').select('causa, criado_em');

    if (periodoSelecionado !== 'todos') {
      const dias = parseInt(periodoSelecionado);
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - dias);
      query = query.gte('criado_em', dataLimite.toISOString());
    }

    const { data, error } = await query;

    if (!error && data) {
      const contagem: Record<string, number> = {};
      data.forEach((item: { causa: string }) => {
        if (item.causa in contagem) {
          contagem[item.causa]++;
        } else {
          contagem[item.causa] = 1;
        }
      });

      const resultado: CategoriaContagem[] = Object.entries(contagem).map(
        ([name, value]) => ({ name, value })
      );

      setDados(resultado);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [periodoSelecionado]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Causas Mais Frequentes</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={dados}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {dados.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default ChartCausaFrequente;
