import { useState, useCallback } from 'react';

interface UseSubmitLockReturn {
  isSubmitting: boolean;
  submitLock: <T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) => (...args: T) => Promise<R>;
  resetSubmitLock: () => void;
}

/**
 * Hook para prevenir double-submit em formulários
 * Bloqueia múltiplas submissões simultâneas
 */
export const useSubmitLock = (): UseSubmitLockReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLock = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R> => {
      if (isSubmitting) {
        throw new Error('Submissão já em andamento');
      }

      setIsSubmitting(true);
      
      try {
        const result = await fn(...args);
        return result;
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [isSubmitting]);

  const resetSubmitLock = useCallback(() => {
    setIsSubmitting(false);
  }, []);

  return {
    isSubmitting,
    submitLock,
    resetSubmitLock
  };
};

/**
 * Hook para confirmação de ações destrutivas
 */
interface UseConfirmationReturn {
  showConfirmation: (message: string, onConfirm: () => void) => void;
  isConfirming: boolean;
  confirmMessage: string | null;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useConfirmation = (): UseConfirmationReturn => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const showConfirmation = useCallback((message: string, onConfirm: () => void) => {
    setConfirmMessage(message);
    setPendingAction(() => onConfirm);
    setIsConfirming(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (pendingAction) {
      pendingAction();
    }
    setIsConfirming(false);
    setConfirmMessage(null);
    setPendingAction(null);
  }, [pendingAction]);

  const handleCancel = useCallback(() => {
    setIsConfirming(false);
    setConfirmMessage(null);
    setPendingAction(null);
  }, []);

  return {
    showConfirmation,
    isConfirming,
    confirmMessage,
    handleConfirm,
    handleCancel
  };
};

/**
 * Hook para gerenciar estados de loading com retry
 */
interface UseLoadingStateReturn {
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  retry: () => void;
  executeWithRetry: <T>(
    fn: () => Promise<T>,
    maxRetries?: number
  ) => Promise<T>;
}

export const useLoadingState = (): UseLoadingStateReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryFn, setRetryFn] = useState<(() => Promise<any>) | null>(null);

  const executeWithRetry = useCallback(async <T>(
    fn: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> => {
    setRetryFn(() => fn);
    setError(null);
    setLoading(true);

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();
        setLoading(false);
        return result;
      } catch (err) {
        lastError = err as Error;
        
        if (attempt === maxRetries) {
          setError(lastError.message || 'Erro inesperado');
          setLoading(false);
          throw lastError;
        }
        
        // Aguardar antes da próxima tentativa (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw lastError;
  }, []);

  const retry = useCallback(() => {
    if (retryFn) {
      executeWithRetry(retryFn);
    }
  }, [retryFn, executeWithRetry]);

  return {
    loading,
    error,
    setLoading,
    setError,
    retry,
    executeWithRetry
  };
};

export default useSubmitLock; 