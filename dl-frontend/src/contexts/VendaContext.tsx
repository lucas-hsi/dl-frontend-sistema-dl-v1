import { createContext, useContext, useState, ReactNode } from 'react';
import { Cliente, ItemOrcamento } from '@/types/orcamento';

interface Vendedor {
  id: number;
  nome: string;
  email?: string;
}

interface VendaContextData {
  cliente: Cliente | null;
  carrinho: ItemOrcamento[];
  produtos: ItemOrcamento[];
  vendedor: Vendedor | null;
  adicionarProduto: (produto: ItemOrcamento) => void;
  setCliente: (cliente: Cliente | null) => void;
  setVendedor: (vendedor: Vendedor | null) => void;
  limparVenda: () => void;
}

const VendaContext = createContext<VendaContextData>({} as VendaContextData);

export const VendaProvider = ({ children }: { children: ReactNode }) => {
  const [produtos, setProdutos] = useState<ItemOrcamento[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [carrinho, setCarrinho] = useState<ItemOrcamento[]>([]);
  const [vendedor, setVendedor] = useState<Vendedor | null>({
    id: 1,
    nome: 'Maria Vendedora',
    email: 'maria@dlautopecas.com'
  });

  const adicionarProduto = (produto: ItemOrcamento) => {
    console.log('🛒 VendaContext - Adicionando produto:', produto);
    setCarrinho((prev) => {
      const novoCarrinho = [...prev, produto];
      console.log('🛒 VendaContext - Carrinho atualizado:', novoCarrinho);
      return novoCarrinho;
    });
  };

  const limparVenda = () => {
    setCliente(null);
    setCarrinho([]);
  };

  return (
    <VendaContext.Provider value={{ 
      produtos, 
      adicionarProduto, 
      cliente, 
      setCliente, 
      carrinho, 
      vendedor,
      setVendedor,
      limparVenda 
    }}>
      {children}
    </VendaContext.Provider>
  );
};

export const useVenda = () => useContext(VendaContext);
export { VendaContext };
