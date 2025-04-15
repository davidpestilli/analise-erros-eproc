import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#b36bff', '#ff6666'];

type CategoriaContagem = {
  name: string;
  value: number;
};

type Props = {
  periodoSelecionado: string;
};

function ChartErroPorCategoria({ periodoSelecionado }: Props) {
  const [dados, setDados] = useState<CategoriaContagem[]>([]);

  const carregarDados = async () => {
    let query = supabase.from('erros_processados').select('categoria, criado_em');

    if (periodoSelecionado !== 'todos') {
      const dias = parseInt(periodoSelecionado);
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - dias);
      query = query.gte('criado_em', dataLimite.toISOString());
    }

    const { data, error } = await query;

    if (!error && data) {
      const contagem: Record<string, number> = {};
      data.forEach((item: { categoria: string }) => {
        if (item.categoria in contagem) {
          contagem[item.categoria]++;
        } else {
          contagem[item.categoria] = 1;
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
    <div className="bg-white p-8 rounded-xl shadow w-full h-[100vh] flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-center">Erros por Categoria</h2>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              outerRadius={290}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {dados.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartErroPorCategoria;
