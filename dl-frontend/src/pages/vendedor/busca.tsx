import React, { useState } from 'react';
import LayoutVendedor from '../../components/layout/LayoutVendedor';
import { BuscaPartNumber } from '../../components/produto/BuscaPartNumber';
import { PartNumberResponse } from '../../services/partNumberService';

const BuscaVendedorPage: React.FC = () => {
  const [historico, setHistorico] = useState<PartNumberResponse[]>([]);

  const handlePartNumberSelecionado = (resultado: PartNumberResponse) => {
    // Adicionar ao histórico
    setHistorico(prev => [resultado, ...prev.slice(0, 9)]); // Manter apenas os 10 últimos
    
    // Aqui você pode adicionar lógica adicional como:
    // - Salvar no localStorage
    // - Enviar para API de histórico
    // - Abrir modal de criação de anúncio
    console.log('Part Number selecionado:', resultado);
  };

  return (
    <LayoutVendedor>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Busca de Part Number
          </h1>
          <p className="text-gray-600">
            Consulte informações detalhadas de peças automotivas usando códigos OEM
          </p>
        </div>

        {/* Componente de Busca */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Buscar Part Number
            </h2>
            
            <BuscaPartNumber
              onPartNumberSelecionado={handlePartNumberSelecionado}
              placeholder="Digite o código OEM (ex: 0986AF1234, 1234567890)..."
              mostrarBotaoUsar={true}
              autoBuscar={false}
            />
          </div>
        </div>

        {/* Histórico de Buscas */}
        {historico.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📋 Histórico de Buscas
            </h2>
            
            <div className="space-y-4">
              {historico.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {item.fonte_dados === 'OpenAI' || item.fonte_dados === 'Manus' ? '🤖' : '🔧'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {item.descricao || item.codigo_oem || 'Part Number encontrado'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {item.fonte_dados}
                    </span>
                  </div>
                  
                  {item.veiculos_compativeis && item.veiculos_compativeis.length > 0 && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Veículos:</span>{' '}
                      {item.veiculos_compativeis.slice(0, 2).map(v => 
                        `${v.marca} ${v.modelo} (${v.ano})`
                      ).join(', ')}
                      {item.veiculos_compativeis.length > 2 && 
                        ` e mais ${item.veiculos_compativeis.length - 2}`
                      }
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'encontrado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status === 'encontrado' ? '✅ Encontrado' : '⚠️ Parcial'}
                    </span>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.recomendacao === 'criar_anuncio'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.recomendacao === 'criar_anuncio' ? '📢 Criar Anúncio' : '📦 No Estoque'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dicas de Uso */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Dicas de Uso
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Digite códigos OEM exatos para melhores resultados</li>
            <li>• O sistema consulta múltiplas fontes simultaneamente</li>
            <li>• Use o botão "Usar Dados" para preencher formulários</li>
            <li>• Resultados são cacheados por 5 minutos</li>
            <li>• IA gera descrições automáticas quando disponível</li>
          </ul>
        </div>
      </div>
    </LayoutVendedor>
  );
};

export default BuscaVendedorPage;
