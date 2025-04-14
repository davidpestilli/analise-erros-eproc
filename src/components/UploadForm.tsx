import React, { useState } from 'react';
import { extractRelevantText } from '../utils/extractRelevantText';
import { toast } from 'sonner';
import { enviarParaAnalise } from '../services/api';

function UploadForm({ onUploadSuccess }) {
  const [arquivos, setArquivos] = useState<FileList | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleUpload = async () => {
    if (!arquivos || arquivos.length === 0) {
      toast.error('Nenhum arquivo selecionado.');
      return;
    }

    setCarregando(true);

    for (let i = 0; i < arquivos.length; i++) {
      const arquivo = arquivos[i];
      const texto = await arquivo.text();
      const trecho = extractRelevantText(texto);

      try {
        await enviarParaAnalise(arquivo.name, trecho);
        toast.success(`Arquivo ${arquivo.name} processado!`);
      } catch (err) {
        toast.error(`Erro ao processar ${arquivo.name}`);
      }
    }

    setCarregando(false);
    if (onUploadSuccess) onUploadSuccess();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Enviar Arquivos .eml</h2>

      <input
        type="file"
        multiple
        accept=".eml"
        onChange={(e) => setArquivos(e.target.files)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={carregando}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {carregando ? 'Processando...' : 'Enviar para Análise'}
      </button>
    </div>
  );
}

export default UploadForm;
