
import { useState } from 'react';
import UploadForm from './components/UploadForm';
import FiltroPeriodo from './components/FiltroPeriodo';
import PainelResumo from './components/PainelResumo';
import ChartErroPorCategoria from './components/ChartErroPorCategoria';
import ChartCausaFrequente from './components/ChartCausaFrequente';
import ChartSolucaoFrequente from './components/ChartSolucaoFrequente';
import ResultTable from './components/ResultTable';
import Filters from './components/Filters';

function App() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('todos');
  const [filtros, setFiltros] = useState({});

  return (
    <div className="w-full px-4">
      <UploadForm onUploadSuccess={() => {}} />

      <FiltroPeriodo periodo={periodoSelecionado} setPeriodo={setPeriodoSelecionado} />
      <Filters onFiltro={setFiltros} />
      <PainelResumo periodoSelecionado={periodoSelecionado} />
      <ChartErroPorCategoria periodoSelecionado={periodoSelecionado} />
      <ChartCausaFrequente periodoSelecionado={periodoSelecionado} />
      <ChartSolucaoFrequente periodoSelecionado={periodoSelecionado} />
      <ResultTable periodoSelecionado={periodoSelecionado} filtros={filtros} />
    </div>
  );
}

export default App;
