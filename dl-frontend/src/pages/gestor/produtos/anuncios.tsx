import LayoutGestor from "@/components/layout/LayoutGestor";
import { iaService } from "@/services/iaService";
import { useState } from "react";

interface Anuncio {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  visualizacoes: number;
  vendas: number;
  status: 'ativo' | 'pausado' | 'inativo';
  canal: string;
}

interface IADiagnostico {
  success: boolean;
  diagnostico?: any;
  error?: string;
}

export default function ProdutosAnunciosPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([
    {
      id: "1",
      titulo: "Amortecedor Dianteiro Honda Civic 2015",
      descricao: "Amortecedor dianteiro original Honda Civic 2015",
      preco: 450.00,
      visualizacoes: 1250,
      vendas: 8,
      status: 'ativo',
      canal: 'mercado_livre'
    },
    {
      id: "2",
      titulo: "Pastilha de Freio Bosch",
      descricao: "Pastilha de freio dianteira Bosch",
      preco: 89.90,
      visualizacoes: 890,
      vendas: 15,
      status: 'ativo',
      canal: 'mercado_livre'
    },
    {
      id: "3",
      titulo: "Filtro de Ar Motor",
      descricao: "Filtro de ar para motor",
      preco: 25.50,
      visualizacoes: 450,
      vendas: 3,
      status: 'pausado',
      canal: 'mercado_livre'
    }
  ]);

  const [selectedAnuncio, setSelectedAnuncio] = useState<Anuncio | null>(null);
  const [diagnostico, setDiagnostico] = useState<IADiagnostico | null>(null);
  const [loadingDiagnostico, setLoadingDiagnostico] = useState(false);
  const [showDiagnostico, setShowDiagnostico] = useState(false);

  const handleDiagnosticarAnuncio = async (anuncio: Anuncio) => {
    setSelectedAnuncio(anuncio);
    setLoadingDiagnostico(true);
    setShowDiagnostico(false);

    try {
      console.log('🤖 IA: Diagnosticando anúncio:', anuncio.titulo);

      const anuncioData = {
        anuncio: {
          titulo: anuncio.titulo,
          descricao: anuncio.descricao,
          preco: anuncio.preco,
          visualizacoes: anuncio.visualizacoes,
          vendas: anuncio.vendas,
          status: anuncio.status,
          canal: anuncio.canal
        }
      };

      const response = await iaService.diagnosticarAnuncio(anuncioData);
      setDiagnostico(response);
      setShowDiagnostico(true);
      console.log('✅ IA: Diagnóstico concluído');
    } catch (error) {
      console.error('❌ IA: Erro ao diagnosticar anúncio:', error);
      setDiagnostico({
        success: false,
        error: 'Erro ao diagnosticar anúncio'
      });
    } finally {
      setLoadingDiagnostico(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceScore = (visualizacoes: number, vendas: number) => {
    if (visualizacoes === 0) return 0;
    const conversao = (vendas / visualizacoes) * 100;
    if (conversao >= 2) return 'Excelente';
    if (conversao >= 1) return 'Boa';
    if (conversao >= 0.5) return 'Regular';
    return 'Baixa';
  };

  return (
    <LayoutGestor>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📣 Anúncios de Produtos
          </h1>
          <p className="text-gray-600">
            Gerencie seus anúncios com inteligência artificial
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Anúncios */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Anúncios Ativos
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {anuncios.length} anúncios encontrados
                </p>
              </div>

              <div className="divide-y">
                {anuncios.map((anuncio) => (
                  <div key={anuncio.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {anuncio.titulo}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(anuncio.status)}`}>
                            {anuncio.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {anuncio.descricao}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Preço:</span>
                            <p className="font-medium">R$ {anuncio.preco.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Visualizações:</span>
                            <p className="font-medium">{anuncio.visualizacoes.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Vendas:</span>
                            <p className="font-medium">{anuncio.vendas}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Performance:</span>
                            <p className="font-medium">{getPerformanceScore(anuncio.visualizacoes, anuncio.vendas)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleDiagnosticarAnuncio(anuncio)}
                          disabled={loadingDiagnostico}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingDiagnostico && selectedAnuncio?.id === anuncio.id ? (
                            '🔄'
                          ) : (
                            '🤖 Diagnóstico IA'
                          )}
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                          ✏️ Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Painel de IA */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🧠 Inteligência Artificial
              </h3>

              {showDiagnostico && diagnostico && selectedAnuncio && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      📊 Diagnóstico: {selectedAnuncio.titulo}
                    </h4>

                    {diagnostico.success ? (
                      <div className="space-y-3">
                        {/* Status do Anúncio */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceScore(selectedAnuncio.visualizacoes, selectedAnuncio.vendas) === 'Excelente'
                            ? 'bg-green-100 text-green-800'
                            : getPerformanceScore(selectedAnuncio.visualizacoes, selectedAnuncio.vendas) === 'Boa'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {getPerformanceScore(selectedAnuncio.visualizacoes, selectedAnuncio.vendas)}
                          </span>
                        </div>

                        {/* Recomendações */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">🎯 Recomendações:</h5>
                          <div className="space-y-2">
                            {getPerformanceScore(selectedAnuncio.visualizacoes, selectedAnuncio.vendas) === 'Excelente' ? (
                              <div className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✅</span>
                                <div>
                                  <p className="text-sm font-medium">Manter estratégia atual</p>
                                  <p className="text-xs text-gray-600">Anúncio performando bem</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">💡</span>
                                  <div>
                                    <p className="text-sm font-medium">Otimizar título</p>
                                    <p className="text-xs text-gray-600">Adicionar palavras-chave relevantes</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-orange-500 mt-1">⚠️</span>
                                  <div>
                                    <p className="text-sm font-medium">Revisar preço</p>
                                    <p className="text-xs text-gray-600">Verificar concorrência</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-purple-500 mt-1">📈</span>
                                  <div>
                                    <p className="text-sm font-medium">Melhorar descrição</p>
                                    <p className="text-xs text-gray-600">Incluir benefícios e especificações</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Métricas */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">📈 Métricas:</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Conversão:</span>
                              <p className="font-medium">
                                {((selectedAnuncio.vendas / selectedAnuncio.visualizacoes) * 100).toFixed(2)}%
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Receita:</span>
                              <p className="font-medium">
                                R$ {(selectedAnuncio.vendas * selectedAnuncio.preco).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h5 className="font-semibold text-red-900 mb-1">❌ Erro no Diagnóstico</h5>
                        <p className="text-sm text-red-700">
                          {diagnostico.error || 'Erro desconhecido'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Informações da IA */}
              <div className="mt-6 space-y-3">
                <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-1">🤖 IA OpenManus</h4>
                  <p className="text-xs text-purple-700">
                    Análise inteligente de performance de anúncios
                  </p>
                </div>

                <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1">📊 Diagnóstico Automático</h4>
                  <p className="text-xs text-blue-700">
                    Identifica problemas e sugere melhorias
                  </p>
                </div>

                <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-1">🎯 Otimização</h4>
                  <p className="text-xs text-green-700">
                    Recomendações baseadas em dados reais
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutGestor>
  );
} 