/**
 * 📦 StatusPecaUnica - Componente de Status de Peça Única
 * 
 * Exibe o status de peças únicas na tabela de estoque,
 * incluindo tags de vendido, canal de venda e movimentações.
 */

import { AlertTriangle, CheckCircle, ExternalLink, History, ShoppingCart, XCircle } from 'lucide-react';
import { useState } from 'react';

interface StatusPecaUnicaProps {
    produto: {
        id: number;
        nome: string;
        status_venda: string;
        canal_venda?: string;
        vendido_em?: string;
        canal_origem: string;
        mlb_id?: string;
    };
    onVerMovimentacoes?: (produtoId: number) => void;
    onVender?: (produtoId: number) => void;
}

export default function StatusPecaUnica({
    produto,
    onVerMovimentacoes,
    onVender
}: StatusPecaUnicaProps) {
    const [loading, setLoading] = useState(false);

    const getStatusColor = () => {
        if (produto.status_venda === 'VENDIDO') {
            return 'text-red-600 bg-red-50 border-red-200';
        }
        return 'text-green-600 bg-green-50 border-green-200';
    };

    const getStatusIcon = () => {
        if (produto.status_venda === 'VENDIDO') {
            return <XCircle className="w-4 h-4" />;
        }
        return <CheckCircle className="w-4 h-4" />;
    };

    const getCanalColor = (canal: string) => {
        const cores = {
            'ML': 'bg-blue-100 text-blue-800 border-blue-200',
            'SHOPIFY': 'bg-purple-100 text-purple-800 border-purple-200',
            'INTERNO': 'bg-gray-100 text-gray-800 border-gray-200',
            'WHATSAPP': 'bg-green-100 text-green-800 border-green-200'
        };
        return cores[canal as keyof typeof cores] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatarData = (data: string) => {
        if (!data) return '';
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleVender = async () => {
        if (!onVender) return;

        try {
            setLoading(true);
            await onVender(produto.id);
        } catch (error) {
            console.error('Erro ao vender produto:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            {/* Status Principal */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}>
                {getStatusIcon()}
                <span>
                    {produto.status_venda === 'VENDIDO' ? 'VENDIDO' : 'DISPONÍVEL'}
                </span>
            </div>

            {/* Informações de Venda */}
            {produto.status_venda === 'VENDIDO' && (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <ShoppingCart className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Vendido via:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getCanalColor(produto.canal_venda || '')}`}>
                            {produto.canal_venda || 'N/A'}
                        </span>
                    </div>

                    {produto.vendido_em && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Vendido em: {formatarData(produto.vendido_em)}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Canal de Origem */}
            <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Origem:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getCanalColor(produto.canal_origem)}`}>
                    {produto.canal_origem.toUpperCase()}
                </span>
            </div>

            {/* MLB ID (se disponível) */}
            {produto.mlb_id && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">MLB:</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {produto.mlb_id}
                    </span>
                </div>
            )}

            {/* Ações */}
            <div className="flex items-center gap-2 pt-2">
                {onVerMovimentacoes && (
                    <button
                        onClick={() => onVerMovimentacoes(produto.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    >
                        <History className="w-3 h-3" />
                        Histórico
                    </button>
                )}

                {produto.status_venda === 'DISPONIVEL' && onVender && (
                    <button
                        onClick={handleVender}
                        disabled={loading}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 rounded"
                    >
                        {loading ? (
                            <>
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                Vendendo...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-3 h-3" />
                                Vender
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Alerta de Peça Única */}
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                <AlertTriangle className="w-3 h-3" />
                <span>Peça única - não há reabastecimento</span>
            </div>
        </div>
    );
} 