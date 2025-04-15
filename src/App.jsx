import { useState, useRef } from 'react';
import UploadForm from './components/UploadForm';
import PainelResumo from './components/PainelResumo';
import ChartErroPorCategoria from './components/ChartErroPorCategoria';
import ResultTable from './components/ResultTable';

function App() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('todos');
  const tabelaRef = useRef(null);

  return (
    <div className="w-full px-6">
      {/* Tela dividida em colunas */}
      <div className="flex flex-col lg:flex-row gap-6 h-screen">
        {/* Lado esquerdo - Upload + Resumo */}
        <div className="flex flex-col gap-6 lg:w-1/3 justify-center h-full">
          <UploadForm onUploadSuccess={() => {}} />
          <PainelResumo periodoSelecionado={periodoSelecionado} />
          
          <button
            onClick={() => {
              tabelaRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded my-6"
          >
            Ir para a Tabela
          </button>

        </div>

        {/* Lado direito - Gráfico ocupa altura total */}
        <div className="flex-1 flex items-center justify-center">
          <ChartErroPorCategoria periodoSelecionado={periodoSelecionado} />
        </div>
      </div>

      {/* Tabela fora da "tela principal" */}
      <div className="mt-10">
      <ResultTable periodoSelecionado={periodoSelecionado} tabelaRef={tabelaRef} />
      </div>
    </div>
  );
}

export default App;
