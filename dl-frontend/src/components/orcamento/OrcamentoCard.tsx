// src/components/orcamento/OrcamentoCard.tsx
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Edit,
  MessageSquare,
  User,
  XCircle
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { orcamentoService } from '../../services/orcamentoService';
import { OrcamentoComStatus, StatusOrcamento, WhatsAppPayload } from '../../types/orcamento';
import { api } from '@/config/api';
import { getApiUrl } from '@/config/env';

interface OrcamentoCardProps {
  orcamento: OrcamentoComStatus;
  onStatusChange: (orcamentoId: number, novoStatus: StatusOrcamento) => void;
  onReabrir: (orcamentoId: number) => void;
}

const getStatusColor = (status: StatusOrcamento) => {
  switch (status) {
    case StatusOrcamento.PENDENTE:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case StatusOrcamento.NEGOCIANDO:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case StatusOrcamento.APROVADO:
      return 'bg-green-100 text-green-800 border-green-200';
    case StatusOrcamento.CONCLUIDO:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case StatusOrcamento.CANCELADO:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: StatusOrcamento) => {
  switch (status) {
    case StatusOrcamento.PENDENTE:
      return <Clock size={16} />;
    case StatusOrcamento.NEGOCIANDO:
      return <Edit size={16} />;
    case StatusOrcamento.APROVADO:
      return <CheckCircle size={16} />;
    case StatusOrcamento.CONCLUIDO:
      return <CheckCircle size={16} />;
    case StatusOrcamento.CANCELADO:
      return <XCircle size={16} />;
    default:
      return <Clock size={16} />;
  }
};

const getStatusText = (status: StatusOrcamento) => {
  switch (status) {
    case StatusOrcamento.PENDENTE:
      return 'Pendente';
    case StatusOrcamento.NEGOCIANDO:
      return 'Negociando';
    case StatusOrcamento.APROVADO:
      return 'Aprovado';
    case StatusOrcamento.CONCLUIDO:
      return 'Concluído';
    case StatusOrcamento.CANCELADO:
      return 'Cancelado';
    default:
      return 'Pendente';
  }
};

export default function OrcamentoCard({ orcamento, onStatusChange, onReabrir }: OrcamentoCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [showErrorMessage, setShowErrorMessage] = useState<string | null>(null);
  const [showFreteDrawer, setShowFreteDrawer] = useState(false);
  const [toastFrete, setToastFrete] = useState<string | null>(null);
  const [toastFreteErro, setToastFreteErro] = useState<string | null>(null);

  const [freteForm, setFreteForm] = useState<{
    cepDestino: string;
    peso: string;
    altura: string;
    largura: string;
    comprimento: string;
  }>({
    cepDestino: '',
    peso: '',
    altura: '',
    largura: '',
    comprimento: '',
  });
  const [freteLoading, setFreteLoading] = useState(false);
  const [freteServicos, setFreteServicos] = useState<any[]>([]);
  const [freteErro, setFreteErro] = useState<string | null>(null);
  const [freteSelecionado, setFreteSelecionado] = useState<any>(null);
  const [valorComFrete, setValorComFrete] = useState<number | null>(null);

  const handleSelecionarFrete = (serv: any) => {
    setFreteSelecionado(serv);
    setValorComFrete(orcamento.valor_total + (serv.price || 0));
  };

  const handleAplicarFrete = async () => {
    if (!freteSelecionado) return;
    setToastFrete(null);
    setToastFreteErro(null);
    try {
      const data = await api.put(`/orcamentos/${orcamento.id}/frete`, {
        transportadora_frete: freteSelecionado.name,
        valor_frete: freteSelecionado.price,
        prazo_frete: freteSelecionado.delivery_time,
        codigo_frete: freteSelecionado.service
      });
      if (data && typeof data === 'object' && 'valor_total' in data) {
        setValorComFrete((data as any).valor_total);
        setToastFrete('Frete aplicado com sucesso!');
        setTimeout(() => setToastFrete(null), 3000);
      }
    } catch (err) {
      setToastFreteErro('Erro ao aplicar frete.');
      setTimeout(() => setToastFreteErro(null), 4000);
    }
  };

  const handleGerarPdfFrete = async () => {
    if (!freteSelecionado) return;
    setToastFrete(null);
    setToastFreteErro(null);
    try {
      // EXCEÇÃO CONTROLADA: download de blob precisa de URL direta para evitar interferência de interceptors
      // Mantido fora do cliente central para garantir download direto do arquivo
      const resp = await fetch(`${getApiUrl()}/orcamentos/${orcamento.id}/frete_pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: freteSelecionado.service,
          name: freteSelecionado.name,
          price: freteSelecionado.price,
          delivery_time: freteSelecionado.delivery_time,
          error: freteSelecionado.error,
          company: freteSelecionado.company,
          company_image: freteSelecionado.company_image,
          tracking_url: freteSelecionado.tracking_url
        })
      });
      if (!resp.ok) throw new Error('Erro ao gerar PDF');
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orcamento_frete_${orcamento.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setToastFrete('PDF gerado com sucesso!');
      setTimeout(() => setToastFrete(null), 3000);
    } catch (err) {
      setToastFreteErro('Erro ao gerar PDF.');
      setTimeout(() => setToastFreteErro(null), 4000);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleStatusChange = async (novoStatus: StatusOrcamento) => {
    setIsLoading(true);
    setShowErrorMessage(null);
    setShowSuccessMessage(null);

    try {
      await orcamentoService.mudarStatusOrcamento({
        orcamento_id: orcamento.id,
        novo_status: novoStatus,
        observacoes: orcamento.observacoes
      });
      onStatusChange(orcamento.id, novoStatus);
      setShowStatusMenu(false);
      setShowSuccessMessage(`Status alterado para ${getStatusText(novoStatus)}`);

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setShowSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Erro ao mudar status:', error);
      setShowErrorMessage(error instanceof Error ? error.message : 'Erro ao mudar status');

      // Limpar mensagem de erro após 5 segundos
      setTimeout(() => setShowErrorMessage(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReabrir = async () => {
    setIsLoading(true);
    setShowErrorMessage(null);
    setShowSuccessMessage(null);

    try {
      await orcamentoService.reabrirOrcamento({
        orcamento_id: orcamento.id,
        vendedor_id: orcamento.vendedor_id
      });
      onReabrir(orcamento.id);
      setShowSuccessMessage('Orçamento reaberto com sucesso');

      setTimeout(() => setShowSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Erro ao reabrir orçamento:', error);
      setShowErrorMessage(error instanceof Error ? error.message : 'Erro ao reabrir orçamento');

      setTimeout(() => setShowErrorMessage(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGerarPDF = async () => {
    setIsLoading(true);
    setShowErrorMessage(null);
    setShowSuccessMessage(null);

    try {
      const pdfData = await orcamentoService.gerarPDFOrcamento(orcamento.id);

      if (pdfData.sucesso) {
        // Fazer download do PDF
        const blob = await orcamentoService.downloadPDF(orcamento.id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orcamento_${orcamento.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setShowSuccessMessage('PDF gerado e baixado com sucesso');
        setTimeout(() => setShowSuccessMessage(null), 3000);
      } else {
        throw new Error(pdfData.erro || 'Erro ao gerar PDF');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setShowErrorMessage(error instanceof Error ? error.message : 'Erro ao gerar PDF');

      setTimeout(() => setShowErrorMessage(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnviarWhatsApp = async () => {
    if (!orcamento.cliente?.telefone) {
      setShowErrorMessage('Telefone do cliente não disponível');
      setTimeout(() => setShowErrorMessage(null), 5000);
      return;
    }

    setIsLoading(true);
    setShowErrorMessage(null);
    setShowSuccessMessage(null);

    try {
      const mensagem = `Olá ${orcamento.cliente.nome}! Aqui está seu orçamento #${orcamento.id} no valor de ${formatarValor(orcamento.valor_total)}. Acesse o link para visualizar: [LINK_PDF]`;

      const payload: WhatsAppPayload = {
        orcamento_id: orcamento.id,
        telefone: orcamento.cliente.telefone,
        mensagem: mensagem
      };

      const response = await orcamentoService.enviarOrcamentoWhatsApp(payload);

      if (response.success) {
        setShowSuccessMessage('Orçamento enviado por WhatsApp com sucesso!');
        setTimeout(() => setShowSuccessMessage(null), 3000);
      } else {
        setShowErrorMessage(response.message || 'Erro ao enviar por WhatsApp');
        setTimeout(() => setShowErrorMessage(null), 5000);
      }
    } catch (error) {
      console.error('Erro ao enviar por WhatsApp:', error);
      setShowErrorMessage(error instanceof Error ? error.message : 'Erro ao enviar por WhatsApp');

      setTimeout(() => setShowErrorMessage(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuscarFrete = async (e: React.FormEvent) => {
    e.preventDefault();
    setFreteLoading(true);
    setFreteErro(null);
    setFreteServicos([]);
    try {
      const payload = {
        cep_origem: '80010-000', // CEP fixo real
        cep_destino: freteForm.cepDestino,
        valor_total: orcamento.valor_total,
        itens: orcamento.itens.map(item => ({
          nome_produto: item.nome_produto,
          peso: (item as any).peso ? Number((item as any).peso) : 1000, // 1000g padrão
          altura: (item as any).altura ? Number((item as any).altura) : 20,
          largura: (item as any).largura ? Number((item as any).largura) : 20,
          comprimento: (item as any).comprimento ? Number((item as any).comprimento) : 20,
          quantidade: item.quantidade,
          valor: item.preco_unitario
        }))
      };

      const data = await orcamentoService.cotarFrete(payload);

      if (data.sucesso && Array.isArray(data.opcoes_frete)) {
        setFreteServicos(data.opcoes_frete);
      } else {
        setFreteErro(data.erro || 'Nenhuma opção de frete encontrada.');
      }
    } catch (err) {
      console.error('Erro ao buscar frete:', err);
      setFreteErro('Erro ao buscar frete. Verifique o CEP e tente novamente.');
    } finally {
      setFreteLoading(false);
    }
  };

  const handleEnviarWhatsappFrete = async () => {
    if (!orcamento.cliente?.telefone || !freteSelecionado) return;
    setToastFrete(null);
    setToastFreteErro(null);
    try {
      // EXCEÇÃO CONTROLADA: download de blob precisa de URL direta para evitar interferência de interceptors
      // Mantido fora do cliente central para garantir download direto do arquivo
      const resp = await fetch(`${getApiUrl()}/orcamentos/${orcamento.id}/frete_pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: freteSelecionado.service,
          name: freteSelecionado.name,
          price: freteSelecionado.price,
          delivery_time: freteSelecionado.delivery_time,
          error: freteSelecionado.error,
          company: freteSelecionado.company,
          company_image: freteSelecionado.company_image,
          tracking_url: freteSelecionado.tracking_url
        })
      });
      if (!resp.ok) throw new Error('Erro ao gerar PDF');
      // Opcional: salvar o PDF em algum storage e obter URL, aqui só simula
      // Envia WhatsApp
      const mensagem = `Olá ${orcamento.cliente.nome}! Segue seu orçamento atualizado com frete (${freteSelecionado.name}, prazo: ${freteSelecionado.delivery_time} dias, valor: R$ ${freteSelecionado.price?.toFixed(2)}).`;
      const response = await orcamentoService.enviarOrcamentoWhatsApp({
        orcamento_id: orcamento.id,
        telefone: orcamento.cliente.telefone,
        mensagem
      });
      if (response.success) {
        setToastFrete('Orçamento enviado por WhatsApp com sucesso!');
        setTimeout(() => setToastFrete(null), 3000);
      } else {
        setToastFreteErro(response.message || 'Erro ao enviar por WhatsApp');
        setTimeout(() => setToastFreteErro(null), 4000);
      }
    } catch (err) {
      setToastFreteErro('Erro ao enviar por WhatsApp.');
      setTimeout(() => setToastFreteErro(null), 4000);
    }
  };

  const handleCalcularFreteOrcamento = async () => {
    try {
      setFreteLoading(true);
      setToastFreteErro(null);

      // Preparar dados do orçamento para cálculo de frete
      const itensOrcamento = orcamento.itens.map(item => ({
        produto_nome: item.nome_produto,
        produto_sku: item.id_produto_tiny,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        valor_desconto: 0, // Campo não disponível no tipo atual
        subtotal_liquido: item.preco_unitario * item.quantidade
      }));

      // Buscar CEP do cliente (simulado - em produção viria do cliente)
      const cepDestino = prompt("Digite o CEP de destino:");
      if (!cepDestino) {
        setToastFreteErro("CEP de destino é obrigatório");
        return;
      }

      const resultado = await orcamentoService.cotarFreteOrcamento({
        itens: itensOrcamento,
        cep_destino: cepDestino
      });

      if (resultado.sucesso) {
        setFreteServicos(resultado.opcoes || []);
        setToastFrete(`Frete calculado: ${resultado.total_opcoes || 0} opções disponíveis`);
      } else {
        setToastFreteErro(resultado.erro || "Erro ao calcular frete");
      }

    } catch (error) {
      console.error('Erro ao calcular frete do orcamento:', error);
      setToastFreteErro("Erro ao calcular frete");
    } finally {
      setFreteLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow relative">
      {/* Mensagens de Feedback */}
      {showSuccessMessage && (
        <div className="absolute top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-3 z-10">
          <div className="flex items-center">
            <Check size={16} className="text-green-500 mr-2" />
            <span className="text-sm text-green-800">{showSuccessMessage}</span>
          </div>
        </div>
      )}

      {showErrorMessage && (
        <div className="absolute top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 z-10">
          <div className="flex items-center">
            <AlertCircle size={16} className="text-red-500 mr-2" />
            <span className="text-sm text-red-800">{showErrorMessage}</span>
          </div>
        </div>
      )}

      {toastFrete && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white bg-green-600">{toastFrete}</div>
      )}
      {toastFreteErro && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white bg-red-600">{toastFreteErro}</div>
      )}

      {/* Drawer de Cotação de Frete */}
      {showFreteDrawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay escuro */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
            onClick={() => setShowFreteDrawer(false)}
            aria-label="Fechar drawer"
          />
          {/* Drawer lateral */}
          <div className="relative ml-auto w-full max-w-xl h-full bg-white shadow-xl animate-slide-in-right overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setShowFreteDrawer(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <div className="p-6 pt-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Cotação de Frete</h2>
              <form onSubmit={handleBuscarFrete} className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP Destino</label>
                  <input type="text" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-orange-500" value={freteForm.cepDestino} onChange={e => setFreteForm(f => ({ ...f, cepDestino: e.target.value }))} placeholder="CEP de entrega" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input type="number" min="0.01" step="0.01" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-orange-500" value={freteForm.peso} onChange={e => setFreteForm(f => ({ ...f, peso: e.target.value }))} placeholder="Peso total" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                    <input type="number" min="1" step="1" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-orange-500" value={freteForm.altura} onChange={e => setFreteForm(f => ({ ...f, altura: e.target.value }))} placeholder="Altura" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Largura (cm)</label>
                    <input type="number" min="1" step="1" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-orange-500" value={freteForm.largura} onChange={e => setFreteForm(f => ({ ...f, largura: e.target.value }))} placeholder="Largura" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comprimento (cm)</label>
                    <input type="number" min="1" step="1" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-orange-500" value={freteForm.comprimento} onChange={e => setFreteForm(f => ({ ...f, comprimento: e.target.value }))} placeholder="Comprimento" />
                  </div>
                </div>
                <button type="submit" disabled={freteLoading} className="w-full py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 mt-4">{freteLoading ? 'Buscando...' : 'Buscar Frete'}</button>
              </form>
              {freteErro && <div className="text-red-600 mb-4">{freteErro}</div>}
              {freteServicos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Opções de Frete</h3>
                  <ul className="divide-y divide-gray-200">
                    {freteServicos.map((serv, idx) => (
                      <li key={idx} className={`py-2 flex flex-col cursor-pointer rounded ${freteSelecionado === serv ? 'bg-orange-100 border border-orange-400' : 'hover:bg-orange-50'}`} onClick={() => handleSelecionarFrete(serv)}>
                        <span><b>{serv.name}</b> ({serv.service})</span>
                        <span>Valor: <b>R$ {serv.price?.toFixed(2)}</b></span>
                        <span>Prazo: {serv.delivery_time} dia(s)</span>
                        {serv.error && <span className="text-red-500">Erro: {serv.error}</span>}
                      </li>
                    ))}
                  </ul>
                  {freteSelecionado && (
                    <div className="mt-4 p-4 bg-gray-50 rounded border">
                      <div className="mb-2 text-sm text-gray-700">Transportadora selecionada: <b>{freteSelecionado.name}</b></div>
                      <div className="flex flex-col gap-1 text-sm">
                        <span>Subtotal: <b>R$ {orcamento.valor_total.toFixed(2)}</b></span>
                        <span>Frete: <b>R$ {freteSelecionado.price?.toFixed(2)}</b></span>
                        <span className="text-lg mt-2">Total: <b>R$ {(valorComFrete || (orcamento.valor_total + (freteSelecionado.price || 0))).toFixed(2)}</b></span>
                      </div>
                      <button type="button" onClick={handleAplicarFrete} className="mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">Aplicar Frete ao Orçamento</button>
                      <button type="button" onClick={handleGerarPdfFrete} className="mt-2 w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">Gerar PDF com frete</button>
                      <button type="button" onClick={handleEnviarWhatsappFrete} className="mt-2 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">📤 Enviar orçamento com frete</button>
                    </div>
                  )}
                </div>
              )}
              {freteLoading && <div className="text-gray-500 mt-4">Buscando opções de frete...</div>}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Orçamento #{orcamento.id}
          </h3>
          <p className="text-sm text-gray-500">
            Criado em {formatarData(orcamento.created_at || '')}
          </p>
        </div>

        <div className="relative">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(orcamento.status)}`}>
            {getStatusIcon(orcamento.status)}
            <span className="ml-1">{getStatusText(orcamento.status)}</span>
          </span>
        </div>
      </div>

      {/* Cliente e Vendedor */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <User size={16} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {orcamento.cliente?.nome || 'Cliente não informado'}
            </p>
            <p className="text-xs text-gray-500">
              {orcamento.cliente?.telefone || 'Telefone não informado'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <User size={16} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {orcamento.vendedor?.nome || 'Vendedor não informado'}
            </p>
            <p className="text-xs text-gray-500">Vendedor</p>
          </div>
        </div>
      </div>

      {/* Itens */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Itens:</h4>
        <div className="space-y-1">
          {orcamento.itens.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantidade}x {item.nome_produto}
              </span>
              <span className="text-gray-900 font-medium">
                {formatarValor(item.preco_unitario * item.quantidade)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded">
        <span className="text-sm font-medium text-gray-900">Total:</span>
        <span className="text-lg font-bold text-gray-900">
          {formatarValor(orcamento.valor_total)}
        </span>
      </div>

      {/* Observações */}
      {orcamento.observacoes && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Observações:</strong> {orcamento.observacoes}
          </p>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-wrap gap-2">
        {/* Mudar Status - Dropdown Melhorado */}
        <div className="relative">
          <Button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center"
          >
            <Edit size={14} className="mr-1" />
            Alterar Status
            <ChevronDown size={14} className="ml-1" />
          </Button>

          {showStatusMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[180px]">
              <div className="p-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-700">Selecione o novo status:</p>
              </div>
              {Object.values(StatusOrcamento).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={status === orcamento.status}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${status === orcamento.status ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{getStatusText(status)}</span>
                    {status === orcamento.status && <Check size={14} className="text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reabrir */}
        {orcamento.status !== StatusOrcamento.PENDENTE && (
          <Button
            onClick={handleReabrir}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white text-xs"
          >
            <Edit size={14} className="mr-1" />
            Reabrir
          </Button>
        )}

        {/* Gerar PDF */}
        <Button
          onClick={handleGerarPDF}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
        >
          <Download size={14} className="mr-1" />
          PDF
        </Button>

        {/* Enviar WhatsApp */}
        {orcamento.cliente?.telefone && (
          <Button
            onClick={handleEnviarWhatsApp}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white text-xs"
          >
            <MessageSquare size={14} className="mr-1" />
            WhatsApp
          </Button>
        )}

        {/* Calcular Frete */}
        <Button
          onClick={() => setShowFreteDrawer(true)}
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
        >
          <ArrowRight size={14} className="mr-1" />
          Calcular Frete
        </Button>

        {/* Calcular Frete do Orçamento */}
        <Button
          onClick={handleCalcularFreteOrcamento}
          disabled={isLoading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
        >
          <Clock size={14} className="mr-1" />
          Calcular Frete Orçamento
        </Button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-sm text-gray-600">Carregando...</div>
        </div>
      )}
    </div>
  );
} 