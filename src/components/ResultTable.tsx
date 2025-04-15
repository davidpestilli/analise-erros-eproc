import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';

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
  tabelaRef: React.RefObject<HTMLDivElement>;
};

function ResultTable({ periodoSelecionado, tabelaRef }: Props) {
  const [resultados, setResultados] = useState<ErroProcessado[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroArquivo, setFiltroArquivo] = useState('');

  const exportarParaExcel = () => {
    const dadosParaExportar = resultadosFiltrados.map(item => ({
      Arquivo: item.nome_arquivo,
      Categoria: item.categoria,
      Causa: item.causa,
      Solução: item.solucao,
      Data: new Date(item.criado_em).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(dadosParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Erros');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `erros_processados_${Date.now()}.xlsx`);
  };

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

  const resultadosFiltrados = resultados.filter((item) =>
    item.categoria.toLowerCase().includes(filtroCategoria.toLowerCase()) &&
    item.nome_arquivo.toLowerCase().includes(filtroArquivo.toLowerCase())
  );

  return (
    <div ref={tabelaRef} className="mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Resultados da Análise</h2>

      {/* Filtros e botão de exportação */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 max-w-6xl">
        <input
          type="text"
          placeholder="Filtrar por categoria"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Filtrar por nome do arquivo"
          value={filtroArquivo}
          onChange={(e) => setFiltroArquivo(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={exportarParaExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          Baixar como Excel
        </button>
      </div>

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
              {resultadosFiltrados.map((item) => (
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
