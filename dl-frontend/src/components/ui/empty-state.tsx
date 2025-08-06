import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

// Componentes específicos para diferentes contextos
const ProductEmptyState: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => (
  <EmptyState
    title="Nenhum produto encontrado"
    description="Comece adicionando seu primeiro produto para gerenciar seu estoque."
    actionText="Adicionar Produto"
    onAction={onAdd}
    icon={
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    }
  />
);

const OrderEmptyState: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => (
  <EmptyState
    title="Nenhum pedido encontrado"
    description="Ainda não há pedidos registrados. Os pedidos aparecerão aqui quando forem criados."
    actionText="Novo Pedido"
    onAction={onAdd}
    icon={
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    }
  />
);

const CustomerEmptyState: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => (
  <EmptyState
    title="Nenhum cliente encontrado"
    description="Comece adicionando seus primeiros clientes para gerenciar suas vendas."
    actionText="Adicionar Cliente"
    onAction={onAdd}
    icon={
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    }
  />
);

const SearchEmptyState: React.FC<{ searchTerm?: string }> = ({ searchTerm }) => (
  <EmptyState
    title="Nenhum resultado encontrado"
    description={searchTerm 
      ? `Não encontramos resultados para "${searchTerm}". Tente ajustar os termos de busca.`
      : "Não encontramos resultados para sua busca. Tente ajustar os filtros."
    }
    icon={
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
  />
);

export { 
  EmptyState, 
  ProductEmptyState, 
  OrderEmptyState, 
  CustomerEmptyState, 
  SearchEmptyState 
};
export default EmptyState; 