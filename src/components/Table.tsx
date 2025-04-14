import React from 'react';

type Processo = {
  id: string;
  reu?: string;
  tjsp?: string;
  superior?: string;
  tribunal?: string;
  situacao?: string;
  gap?: string;
  created_at?: string;
};

type Props = {
  dados: Processo[];
  carregando: boolean;
};

function Table({ dados, carregando }: Props) {
  if (carregando) return <p>Carregando dados...</p>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Réu</th>
            <th className="px-4 py-2 border">TJSP</th>
            <th className="px-4 py-2 border">Superior</th>
            <th className="px-4 py-2 border">Tribunal</th>
            <th className="px-4 py-2 border">Situação</th>
            <th className="px-4 py-2 border">GAP</th>
            <th className="px-4 py-2 border">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 border">{item.reu}</td>
              <td className="px-4 py-2 border">{item.tjsp}</td>
              <td className="px-4 py-2 border">{item.superior}</td>
              <td className="px-4 py-2 border">{item.tribunal}</td>
              <td className="px-4 py-2 border">{item.situacao}</td>
              <td className="px-4 py-2 border">{item.gap}</td>
              <td className="px-4 py-2 border">
                {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
