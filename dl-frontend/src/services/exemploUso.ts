import { salvarOrcamento } from './orcamentoService';
import { OrcamentoPayload } from '@/types/orcamento';

// Exemplo de uso do serviço de orçamento
export const exemploSalvarOrcamento = async () => {
  const payload: OrcamentoPayload = {
    cliente_id: 1,
    vendedor_id: 1,
    valor_total: 500.00,
    itens: [
      {
        id_produto_tiny: "12345",
        nome_produto: "Parachoque Onix 2019",
        quantidade: 1,
        preco_unitario: 250.00
      },
      {
        id_produto_tiny: "67890",
        nome_produto: "Retrovisor Gol G6",
        quantidade: 2,
        preco_unitario: 125.00
      }
    ]
  };

  try {
    const resultado = await salvarOrcamento(payload);
    console.log('Orçamento salvo com ID:', resultado.id);
    return resultado;
  } catch (error) {
    console.error('Falha ao salvar orçamento:', error);
    throw error;
  }
}; 