
import React, { useState } from 'react';

type Props = {
  onFiltro: (filtros: {
    categoria: string;
    nomeArquivo: string;
    dataMinima: string;
  }) => void;
};

function Filters({ onFiltro }: Props) {
  const [categoria, setCategoria] = useState('');
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [dataMinima, setDataMinima] = useState('');

  const aplicar = () => {
    onFiltro({ categoria, nomeArquivo, dataMinima });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl p-4 shadow grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium mb-1">Categoria</label>
        <input
          type="text"
          placeholder="Ex: parte ausente"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nome do Arquivo</label>
        <input
          type="text"
          placeholder="Ex: erro123.eml"
          value={nomeArquivo}
          onChange={(e) => setNomeArquivo(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Data Mínima</label>
        <input
          type="date"
          value={dataMinima}
          onChange={(e) => setDataMinima(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="col-span-full text-right mt-2">
        <button
          onClick={aplicar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

export default Filters;
