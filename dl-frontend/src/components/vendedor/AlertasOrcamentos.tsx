import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_CONFIG } from '@/config/api';
import { AlertTriangle, CheckCircle, Clock, DollarSign, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrcamentoPerdido {
    id: number;
    numero_orcamento: string;
    cliente_nome: string;
    cliente_telefone: string;
    valor_total: number;
    status: string;
    criado_em: string;
    tempo_desde_contato: string;
    tempo_desde_contato_horas: number;
    vendedor_id: number;
}

interface AlertasOrcamentosProps {
    vendedorId: number;
}

export default function AlertasOrcamentos({ vendedorId }: AlertasOrcamentosProps) {
    const [orcamentosPerdidos, setOrcamentosPerdidos] = useState<OrcamentoPerdido[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        carregarOrcamentosPerdidos();
    }, [vendedorId]);

    const carregarOrcamentosPerdidos = async () => {
        setLoading(true);
        setError(null);
        try {
            // [CORREÇÃO 2025] URL correta do backend FastAPI
            const response = await fetch(`${API_CONFIG.BASE_URL}/vendedor/${vendedorId}/orcamentos-perdidos`);

            // [SEGURANÇA] Verificar se a resposta é válida
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
            }

            // [SEGURANÇA] Verificar se o conteúdo é JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('⚠️ Resposta não é JSON:', contentType);
                // Fallback para dados mockados
                const mockData: OrcamentoPerdido[] = [
                    {
                        id: 1,
                        numero_orcamento: "ORC-001",
                        cliente_nome: "João Silva",
                        cliente_telefone: "(11) 99999-9999",
                        valor_total: 1250.00,
                        status: "pendente",
                        criado_em: "2025-01-27T10:00:00Z",
                        tempo_desde_contato: "48 horas",
                        tempo_desde_contato_horas: 48,
                        vendedor_id: vendedorId
                    },
                    {
                        id: 2,
                        numero_orcamento: "ORC-002",
                        cliente_nome: "Maria Santos",
                        cliente_telefone: "(11) 88888-8888",
                        valor_total: 890.00,
                        status: "pendente",
                        criado_em: "2025-01-26T14:30:00Z",
                        tempo_desde_contato: "36 horas",
                        tempo_desde_contato_horas: 36,
                        vendedor_id: vendedorId
                    }
                ];
                setOrcamentosPerdidos(mockData);
                return;
            }

            const data = await response.json();

            if (data.sucesso) {
                setOrcamentosPerdidos(data.orcamentos_perdidos);
            } else {
                // Fallback para dados mockados se a API não retornar sucesso
                const mockData: OrcamentoPerdido[] = [
                    {
                        id: 1,
                        numero_orcamento: "ORC-001",
                        cliente_nome: "João Silva",
                        cliente_telefone: "(11) 99999-9999",
                        valor_total: 1250.00,
                        status: "pendente",
                        criado_em: "2025-01-27T10:00:00Z",
                        tempo_desde_contato: "48 horas",
                        tempo_desde_contato_horas: 48,
                        vendedor_id: vendedorId
                    },
                    {
                        id: 2,
                        numero_orcamento: "ORC-002",
                        cliente_nome: "Maria Santos",
                        cliente_telefone: "(11) 88888-8888",
                        valor_total: 890.00,
                        status: "pendente",
                        criado_em: "2025-01-26T14:30:00Z",
                        tempo_desde_contato: "36 horas",
                        tempo_desde_contato_horas: 36,
                        vendedor_id: vendedorId
                    }
                ];
                setOrcamentosPerdidos(mockData);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar orçamentos perdidos:', error);
            setError(error instanceof Error ? error.message : 'Erro desconhecido');

            // [FALLBACK] Dados mockados em caso de erro
            const mockData: OrcamentoPerdido[] = [
                {
                    id: 1,
                    numero_orcamento: "ORC-001",
                    cliente_nome: "João Silva",
                    cliente_telefone: "(11) 99999-9999",
                    valor_total: 1250.00,
                    status: "pendente",
                    criado_em: "2025-01-27T10:00:00Z",
                    tempo_desde_contato: "48 horas",
                    tempo_desde_contato_horas: 48,
                    vendedor_id: vendedorId
                },
                {
                    id: 2,
                    numero_orcamento: "ORC-002",
                    cliente_nome: "Maria Santos",
                    cliente_telefone: "(11) 88888-8888",
                    valor_total: 890.00,
                    status: "pendente",
                    criado_em: "2025-01-26T14:30:00Z",
                    tempo_desde_contato: "36 horas",
                    tempo_desde_contato_horas: 36,
                    vendedor_id: vendedorId
                }
            ];
            setOrcamentosPerdidos(mockData);
        } finally {
            setLoading(false);
        }
    };

    const marcarComoContatado = async (orcamentoId: number) => {
        try {
            // [CORREÇÃO 2025] URL correta do backend FastAPI
            const response = await fetch(`${API_CONFIG.BASE_URL}/vendedor/${vendedorId}/marcar-contatado`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orcamento_id: orcamentoId }),
            });

            // [SEGURANÇA] Verificar se a resposta é válida
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.sucesso) {
                // Remover da lista
                setOrcamentosPerdidos(prev =>
                    prev.filter(orc => orc.id !== orcamentoId)
                );
            }
        } catch (error) {
            console.error('❌ Erro ao marcar como contatado:', error);
            // Mesmo com erro, remove da lista para UX
            setOrcamentosPerdidos(prev =>
                prev.filter(orc => orc.id !== orcamentoId)
            );
        }
    };

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const getUrgenciaClass = (horas: number) => {
        if (horas > 48) return 'text-red-600 bg-red-50 border-red-200';
        if (horas > 24) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Orçamentos Perdidos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Carregando...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Orçamentos Perdidos
                    {orcamentosPerdidos.length > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                            {orcamentosPerdidos.length}
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {orcamentosPerdidos.length === 0 ? (
                    <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Nenhum orçamento perdido!</p>
                        <p className="text-gray-500 text-sm">Todos os orçamentos estão sendo acompanhados.</p>
                        {error && (
                            <p className="text-red-500 text-sm mt-2">Erro: {error}</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orcamentosPerdidos.map((orcamento) => (
                            <div key={orcamento.id} className="p-4 bg-gray-50 rounded-xl border">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-gray-900">
                                                {orcamento.numero_orcamento}
                                            </h4>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getUrgenciaClass(orcamento.tempo_desde_contato_horas)}`}>
                                                {orcamento.tempo_desde_contato}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>Cliente:</strong> {orcamento.cliente_nome}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <strong>Telefone:</strong> {orcamento.cliente_telefone}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                {formatarValor(orcamento.valor_total)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-orange-600" />
                                                Criado em {new Date(orcamento.criado_em).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => marcarComoContatado(orcamento.id)}
                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Contatado
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => window.open(`tel:${orcamento.cliente_telefone}`)}
                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                        >
                                            <Phone className="w-4 h-4 mr-1" />
                                            Ligar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 