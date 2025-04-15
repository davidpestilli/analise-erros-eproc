import { useState } from 'react';
import UploadForm from './components/UploadForm';
import PainelResumo from './components/PainelResumo';
import ChartErroPorCategoria from './components/ChartErroPorCategoria';
import ResultTable from './components/ResultTable';

function App() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('todos');

  return (
    <div className="w-full px-6">
      {/* Tela dividida em colunas */}
      <div className="flex flex-col lg:flex-row gap-6 h-screen">
        {/* Lado esquerdo - Upload + Resumo */}
        <div className="flex flex-col gap-6 lg:w-1/3 justify-center h-full">
          <UploadForm onUploadSuccess={() => {}} />
          <PainelResumo periodoSelecionado={periodoSelecionado} />
        </div>

        {/* Lado direito - Gráfico ocupa altura total */}
        <div className="flex-1 flex items-center justify-center">
          <ChartErroPorCategoria periodoSelecionado={periodoSelecionado} />
        </div>
      </div>

      {/* Tabela fora da "tela principal" */}
      <div className="mt-10">
        <ResultTable periodoSelecionado={periodoSelecionado} filtros={{}} />
      </div>
    </div>
  );
}

export default App;
