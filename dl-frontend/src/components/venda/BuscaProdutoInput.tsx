import React, { useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

interface BuscaProdutoInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  loading: boolean;
  disabled: boolean;
  autoFocus?: boolean;
}

const BuscaProdutoInput = ({ 
  value, 
  onChange, 
  onSearch, 
  onKeyPress, 
  loading, 
  disabled,
  autoFocus = true
}: BuscaProdutoInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoização dos handlers para evitar remounts
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    onKeyPress(e);
  }, [onKeyPress]);

  // Foco robusto: só foca se autoFocus for true OU se o input já estava focado
  useEffect(() => {
    if (!inputRef.current) return;
    if (autoFocus && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  }, [value, autoFocus]);

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Digite pelo menos 3 letras para buscar..."
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus={autoFocus}
        />
        <button
          onClick={onSearch}
          disabled={disabled}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Buscar produtos"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      <button
        onClick={onSearch}
        disabled={disabled}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Buscando...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Buscar
          </>
        )}
      </button>
    </div>
  );
};

export default BuscaProdutoInput; 