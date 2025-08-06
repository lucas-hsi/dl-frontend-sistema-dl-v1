import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  showRetry?: boolean;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Erro ao carregar dados',
  message = 'Ocorreu um erro inesperado. Tente novamente.',
  onRetry,
  retryText = 'Tentar Novamente',
  showRetry = true,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4 text-red-500">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {retryText}
        </button>
      )}
    </div>
  );
};

// Componentes específicos para diferentes tipos de erro
const NetworkErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Erro de conexão"
    message="Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente."
    onRetry={onRetry}
    retryText="Tentar Novamente"
  />
);

const ServerErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Erro do servidor"
    message="O servidor está temporariamente indisponível. Tente novamente em alguns minutos."
    onRetry={onRetry}
    retryText="Tentar Novamente"
  />
);

const NotFoundErrorState: React.FC<{ resource?: string }> = ({ resource = 'recurso' }) => (
  <ErrorState
    title={`${resource} não encontrado`}
    message={`O ${resource} que você está procurando não foi encontrado ou foi removido.`}
    showRetry={false}
  />
);

const PermissionErrorState: React.FC = () => (
  <ErrorState
    title="Acesso negado"
    message="Você não tem permissão para acessar este recurso. Entre em contato com o administrador se acredita que isso é um erro."
    showRetry={false}
  />
);

// Hook para gerenciar estados de erro
interface UseErrorStateReturn {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  hasError: boolean;
}

const useErrorState = (): UseErrorStateReturn => {
  const [error, setError] = React.useState<string | null>(null);

  const clearError = () => setError(null);
  const hasError = !!error;

  return {
    error,
    setError,
    clearError,
    hasError
  };
};

export { 
  ErrorState, 
  NetworkErrorState, 
  ServerErrorState, 
  NotFoundErrorState, 
  PermissionErrorState,
  useErrorState
};
export default ErrorState; 