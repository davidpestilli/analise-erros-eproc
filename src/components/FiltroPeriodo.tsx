import React from 'react';

type Props = {
  periodo: string;
  setPeriodo: (valor: string) => void;
};

function FiltroPeriodo({ periodo, setPeriodo }: Props) {
  return (
    <div className="flex items-center gap-2 my-6">
      <label className="font-medium">Filtrar por período:</label>
      <select
        className="border rounded p-2"
        value={periodo}
        onChange={(e) => setPeriodo(e.target.value)}
      >
        <option value="todos">Todos</option>
        <option value="7">Últimos 7 dias</option>
        <option value="30">Últimos 30 dias</option>
      </select>
    </div>
  );
}

export default FiltroPeriodo;
