import React, { useState, useEffect } from "react";
import { 
  Truck, 
  Upload, 
  Save, 
  Calendar, 
  DollarSign, 
  Car, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Hash,
  Building2,
  Eye,
  X
} from "lucide-react";
import LayoutGestor from "@/components/layout/LayoutGestor";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface Sucata {
  id: string;
  sku_mestre: string;
  data_entrada: string;
  valor_pago: number;
  identificador_veiculo: string;
  observacoes: string;
  nota_fiscal?: File;
  created_at: string;
}

export default function EntradaSucata() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  // Estados do formulário
  const [dataEntrada, setDataEntrada] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [identificadorVeiculo, setIdentificadorVeiculo] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [notaFiscal, setNotaFiscal] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [skuGerado, setSkuGerado] = useState("");

  // Lista de sucatas cadastradas (mock)
  const [sucatasCadastradas, setSucatasCadastradas] = useState<Sucata[]>([
    {
      id: "1",
      sku_mestre: "SC-4B32-241025-0001",
      data_entrada: "2024-10-25",
      valor_pago: 2500,
      identificador_veiculo: "Honda Civic 2018 - ABC4B32",
      observacoes: "Veículo com motor funcionando, lataria danificada",
      created_at: "2024-10-25T08:30:00"
    },
    {
      id: "2", 
      sku_mestre: "SC-7Y89-241020-0002",
      data_entrada: "2024-10-20",
      valor_pago: 1800,
      identificador_veiculo: "Toyota Corolla 2016 - XYZ7Y89",
      observacoes: "Veículo sinistrado, peças em bom estado",
      created_at: "2024-10-20T14:15:00"
    }
  ]);

  useEffect(() => {
    setMounted(true);
    // Definir data atual como padrão
    const hoje = new Date().toISOString().split('T')[0];
    setDataEntrada(hoje);
  }, []);

  // Proteção de acesso
  if (loading || !mounted || !user || user.perfil !== "GESTOR") {
    return null;
  }

  // Função para gerar SKU mestre
  const gerarSkuMestre = (veiculo: string, data: string): string => {
    const ultimosCaracteres = veiculo.slice(-4).toUpperCase();
    const dataFormatada = data.replace(/-/g, '').slice(2); // YYMMDD
    const proximoId = String(sucatasCadastradas.length + 1).padStart(4, '0');
    return `SC-${ultimosCaracteres}-${dataFormatada}-${proximoId}`;
  };

  // Handler do upload de arquivo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ['application/pdf', 'application/xml', 'text/xml'];
      if (allowedTypes.includes(file.type)) {
        setNotaFiscal(file);
      } else {
        alert('Apenas arquivos PDF ou XML são permitidos.');
      }
    }
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Gerar SKU mestre
      const sku = gerarSkuMestre(identificadorVeiculo, dataEntrada);
      setSkuGerado(sku);

      // Simular cadastro (aqui seria a integração com o backend)
      const novaSucata: Sucata = {
        id: String(sucatasCadastradas.length + 1),
        sku_mestre: sku,
        data_entrada: dataEntrada,
        valor_pago: parseFloat(valorPago),
        identificador_veiculo: identificadorVeiculo,
        observacoes: observacoes,
        nota_fiscal: notaFiscal || undefined,
        created_at: new Date().toISOString()
      };

      // Adicionar à lista
      setSucatasCadastradas(prev => [novaSucata, ...prev]);

      // Simular notificação ao painel de anúncios
      console.log('🔔 Notificação enviada ao Painel de Anúncios:', {
        action: 'nova_sucata_cadastrada',
        sku_mestre: sku,
        valor_pago: parseFloat(valorPago)
      });

      // Mostrar sucesso
      setShowSuccess(true);

      // Limpar formulário
      setValorPago("");
      setIdentificadorVeiculo("");
      setObservacoes("");
      setNotaFiscal(null);

      // Reset do input de arquivo
      const fileInput = document.getElementById('nota-fiscal') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Erro ao cadastrar sucata:', error);
      alert('Erro ao cadastrar sucata. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <Truck className="w-12 h-12" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Entrada de Sucata</h1>
                <p className="text-green-100 opacity-90">Cadastro e controle de aquisições para desmanche</p>
              </div>
            </div>
          </div>

          {/* Mensagem de Sucesso */}
          {showSuccess && (
            <div className="bg-green-500 text-white rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              <div className="flex-1">
                <h3 className="font-bold">Sucata cadastrada com sucesso!</h3>
                <p className="text-sm opacity-90">SKU Mestre gerado: <span className="font-mono font-bold">{skuGerado}</span></p>
              </div>
              <button 
                onClick={() => setShowSuccess(false)}
                className="text-white hover:text-green-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário de Cadastro */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-green-500" />
                Cadastrar Nova Sucata
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Data de Entrada */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Data da Entrada *
                  </label>
                  <input
                    type="date"
                    value={dataEntrada}
                    onChange={(e) => setDataEntrada(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                {/* Valor Pago */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4" />
                    Valor Pago na Sucata *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={valorPago}
                      onChange={(e) => setValorPago(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>

                {/* Identificador do Veículo */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Car className="w-4 h-4" />
                    Identificador do Veículo *
                  </label>
                  <input
                    type="text"
                    value={identificadorVeiculo}
                    onChange={(e) => setIdentificadorVeiculo(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Ex: Honda Civic 2018 - ABC1234 ou Placa ABC1234"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Os últimos 4 caracteres serão usados para gerar o SKU mestre
                  </p>
                </div>

                {/* Upload da Nota Fiscal */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Upload className="w-4 h-4" />
                    Nota Fiscal (PDF ou XML)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                    <input
                      type="file"
                      id="nota-fiscal"
                      accept=".pdf,.xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="nota-fiscal" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {notaFiscal ? notaFiscal.name : 'Clique para fazer upload ou arraste o arquivo'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF ou XML (máx. 10MB)</p>
                    </label>
                  </div>
                  {notaFiscal && (
                    <div className="mt-2 flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Arquivo selecionado: {notaFiscal.name}</span>
                    </div>
                  )}
                </div>

                {/* Observações */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4" />
                    Observações
                  </label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    placeholder="Ex: Estado geral do veículo, peças destacadas, condições especiais..."
                  />
                </div>

                {/* Botão de Submissão */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Cadastrar Sucata
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Informações e Sucatas Recentes */}
            <div className="space-y-6">
              {/* Como Funciona */}
              <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Como Funciona
                </h3>
                <div className="space-y-3 text-sm text-blue-700">
                  <div className="flex items-start gap-2">
                    <Hash className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>SKU mestre é gerado automaticamente</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Painel de Anúncios será notificado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Retorno será calculado automaticamente</span>
                  </div>
                </div>
              </div>

              {/* Sucatas Recentes */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-500" />
                  Sucatas Recentes
                </h3>
                <div className="space-y-3">
                  {sucatasCadastradas.slice(0, 3).map((sucata) => (
                    <div key={sucata.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="font-mono text-sm font-bold text-gray-800 mb-1">
                        {sucata.sku_mestre}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {sucata.identificador_veiculo}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-green-600">
                          R$ {sucata.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(sucata.data_entrada).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 