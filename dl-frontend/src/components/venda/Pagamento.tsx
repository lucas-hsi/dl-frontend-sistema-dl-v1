// src/components/venda/Pagamento.tsx
import { Button } from '@/components/ui/button'
import { useVenda } from '@/contexts/VendaContext'
import { OrcamentoCreate, orcamentoService } from '@/services/orcamentoService'
import { useState } from 'react'
// Adicionar import para serviço de desconto
// import { solicitarDesconto } from '@/services/descontoService'

export default function Pagamento() {
  const { cliente, carrinho, limparVenda } = useVenda()
  const [formaPagamento, setFormaPagamento] = useState('PIX')
  const [observacao, setObservacao] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // Estado para desconto
  const [desconto, setDesconto] = useState(0)
  const [motivoDesconto, setMotivoDesconto] = useState('')
  const [statusDesconto, setStatusDesconto] = useState<'nenhum' | 'pendente' | 'aprovado' | 'rejeitado'>('nenhum')
  const [isSolicitando, setIsSolicitando] = useState(false)
  const [erroDesconto, setErroDesconto] = useState<string | null>(null)

  const valorOriginal = carrinho.reduce((total, item) => total + (item.preco_unitario * item.quantidade), 0)
  const valorComDesconto = valorOriginal * (1 - desconto / 100)
  const percentualDesconto = desconto

  const gerarPayload = (): OrcamentoCreate => {
    return {
      cliente_id: cliente?.id ? parseInt(cliente.id) : 1, // ID padrão se não houver cliente
      observacoes: observacao,
      itens: carrinho.map(item => ({
        produto_id: parseInt(item.id_produto_tiny.toString()),
        quantidade: item.quantidade,
        valor_unitario: item.preco_unitario,
        desconto_percentual: 0,
        desconto_valor: 0,
        observacoes: ''
      }))
    }
  }

  const salvarOrcamentoHandler = async () => {
    if (carrinho.length === 0) {
      alert('Adicione produtos ao carrinho antes de salvar o orçamento!')
      return
    }

    setIsLoading(true)
    try {
      const payload = gerarPayload()
      const resultado = await orcamentoService.criarOrcamento(payload, 1) // vendedor_id = 1
      alert(`Orçamento #${resultado.id} salvo com sucesso!`)
      limparVenda()
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error)
      alert('Erro ao salvar orçamento. Verifique os dados e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      alert('Adicione produtos ao carrinho antes de finalizar a venda!')
      return
    }

    setIsLoading(true)
    try {
      const payload = gerarPayload()
      const resultado = await orcamentoService.criarOrcamento(payload, 1) // vendedor_id = 1
      alert(`Venda #${resultado.id} finalizada com sucesso!`)
      limparVenda()
    } catch (error) {
      console.error('Erro ao finalizar venda:', error)
      alert('Erro ao finalizar venda. Verifique os dados e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para solicitar aprovação de desconto
  const solicitarAprovacaoDesconto = async () => {
    setIsSolicitando(true)
    setErroDesconto(null)
    try {
      // Aqui você faria a chamada real para o backend de descontos
      // await solicitarDesconto({ ... })
      // Simulação:
      setTimeout(() => {
        setStatusDesconto('pendente')
        setIsSolicitando(false)
      }, 1000)
    } catch (error) {
      setErroDesconto('Erro ao solicitar aprovação de desconto.')
      setIsSolicitando(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Forma de Pagamento</h2>

      {/* Campo de desconto */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
        <input
          type="number"
          min={0}
          max={100}
          value={desconto}
          onChange={e => setDesconto(Number(e.target.value))}
          className="border p-2 rounded w-full max-w-xs"
          disabled={statusDesconto === 'pendente'}
        />
        {desconto > 0 && (
          <div className="text-sm text-gray-600 mt-1">
            Valor original: <span className="font-semibold">R$ {valorOriginal.toFixed(2)}</span> <br />
            Valor com desconto: <span className="font-semibold text-green-700">R$ {valorComDesconto.toFixed(2)}</span> <br />
            Percentual: <span className="font-semibold">{percentualDesconto}%</span>
          </div>
        )}
      </div>

      {/* Motivo do desconto (opcional) */}
      {desconto > 10 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo do desconto (opcional)</label>
          <textarea
            className="border p-2 rounded w-full"
            value={motivoDesconto}
            onChange={e => setMotivoDesconto(e.target.value)}
            disabled={statusDesconto === 'pendente'}
          />
        </div>
      )}

      {/* Status da solicitação de desconto */}
      {statusDesconto === 'pendente' && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
          Aguardando aprovação do gestor para desconto acima de 10%.
        </div>
      )}
      {statusDesconto === 'aprovado' && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded">
          Desconto aprovado pelo gestor! Você pode finalizar a venda.
        </div>
      )}
      {statusDesconto === 'rejeitado' && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded">
          Desconto rejeitado pelo gestor. Ajuste o valor ou solicite novamente.
        </div>
      )}
      {erroDesconto && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded">
          {erroDesconto}
        </div>
      )}

      <select
        className="border p-2 rounded mb-4 w-full"
        value={formaPagamento}
        onChange={(e) => setFormaPagamento(e.target.value)}
        disabled={statusDesconto === 'pendente'}
      >
        <option value="PIX">PIX</option>
        <option value="DINHEIRO">Dinheiro</option>
        <option value="CARTAO">Cartão</option>
      </select>

      <textarea
        className="border p-2 rounded mb-4 w-full"
        placeholder="Observações adicionais"
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
        disabled={statusDesconto === 'pendente'}
      />

      <div className="flex gap-4">
        <Button
          onClick={salvarOrcamentoHandler}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
          disabled={isLoading || statusDesconto === 'pendente'}
        >
          {isLoading ? 'Salvando...' : 'Salvar como Orçamento'}
        </Button>
        <Button
          onClick={finalizarVenda}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isLoading || desconto > 10 || statusDesconto === 'pendente'}
        >
          {isLoading ? 'Finalizando...' : 'Finalizar Venda'}
        </Button>
        {desconto > 10 && statusDesconto !== 'pendente' && (
          <Button
            onClick={solicitarAprovacaoDesconto}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSolicitando}
          >
            {isSolicitando ? 'Solicitando...' : 'Solicitar Aprovação'}
          </Button>
        )}
      </div>
    </div>
  )
}
