import {
    BarChart3,
    Calendar,
    Clock,
    DollarSign,
    Download,
    RefreshCw,
    TrendingUp,
    Truck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import LayoutGestor from '../../components/layout/LayoutGestor';
import { api } from '@/config/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

interface EstatisticaTransportadora {
    transportadora: string;
    valor_medio: number;
    prazo_medio: number;
    quantidade_usos: number;
    categoria_mais_frequente: number;
}

interface EstatisticasGerais {
    total_calculos: number;
    calculos_sucesso: number;
    taxa_sucesso: number;
    valor_medio_geral: number;
    prazo_medio_geral: number;
    transportadora_mais_usada: string;
    usos_transportadora_mais_usada: number;
}

interface HistoricoFrete {
    id: number;
    transportadora: string;
    valor_frete: number;
    prazo_entrega: number;
    cep_origem: string;
    cep_destino: string;
    data_calculo: string;
    sucesso: boolean;
}

export default function RelatoriosFrete() {
    const [estatisticasTransportadoras, setEstatisticasTransportadoras] = useState<EstatisticaTransportadora[]>([]);
    const [estatisticasGerais, setEstatisticasGerais] = useState<EstatisticasGerais | null>(null);
    const [historicoRecente, setHistoricoRecente] = useState<HistoricoFrete[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const carregarRelatorios = async () => {
        setLoading(true);
        try {
            // Carregar estatísticas por transportadora
            const params = new URLSearchParams({
                ...(dataInicio && { data_inicio: dataInicio }),
                ...(dataFim && { data_fim: dataFim })
            });
            const dataTransportadoras = await api.get(`/frete/relatorio-transportadoras?${params}`);

            if (dataTransportadoras && typeof dataTransportadoras === 'object' && 'sucesso' in dataTransportadoras && dataTransportadoras.sucesso === true) {
                if ('estatisticas_por_transportadora' in dataTransportadoras && Array.isArray((dataTransportadoras as any).estatisticas_por_transportadora)) {
                    setEstatisticasTransportadoras((dataTransportadoras as any).estatisticas_por_transportadora);
                }
                if ('estatisticas_gerais' in dataTransportadoras && typeof (dataTransportadoras as any).estatisticas_gerais === 'object') {
                    setEstatisticasGerais((dataTransportadoras as any).estatisticas_gerais);
                }
            }

            // Carregar histórico recente
            const dataHistorico = await api.get('/frete/historico-recente?dias=30');

            if (dataHistorico && typeof dataHistorico === 'object' && 'sucesso' in dataHistorico && dataHistorico.sucesso === true && 'historico' in dataHistorico && Array.isArray((dataHistorico as any).historico)) {
                setHistoricoRecente((dataHistorico as any).historico);
            }
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarRelatorios();
    }, []);

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    return (
        <LayoutGestor>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Relatórios de Frete</h1>
                        <p className="text-gray-600">Análise de custos e performance das transportadoras</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={carregarRelatorios} disabled={loading}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Atualizar
                        </Button>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                    </div>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data Início
                                </label>
                                <Input
                                    type="date"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data Fim
                                </label>
                                <Input
                                    type="date"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button onClick={carregarRelatorios} disabled={loading}>
                                    Aplicar Filtros
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Estatísticas Gerais */}
                {estatisticasGerais && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total de Cálculos</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {estatisticasGerais.total_calculos}
                                        </p>
                                    </div>
                                    <BarChart3 className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {estatisticasGerais.taxa_sucesso}%
                                        </p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatarValor(estatisticasGerais.valor_medio_geral)}
                                        </p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Prazo Médio</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {estatisticasGerais.prazo_medio_geral} dias
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Estatísticas por Transportadora */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            Estatísticas por Transportadora
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">
                                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                                <p className="text-gray-500 mt-2">Carregando dados...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium">Transportadora</th>
                                            <th className="text-left py-3 px-4 font-medium">Valor Médio</th>
                                            <th className="text-left py-3 px-4 font-medium">Prazo Médio</th>
                                            <th className="text-left py-3 px-4 font-medium">Quantidade de Usos</th>
                                            <th className="text-left py-3 px-4 font-medium">Categoria Mais Frequente</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {estatisticasTransportadoras.map((estat, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 font-medium">{estat.transportadora}</td>
                                                <td className="py-3 px-4">{formatarValor(estat.valor_medio)}</td>
                                                <td className="py-3 px-4">{estat.prazo_medio} dias</td>
                                                <td className="py-3 px-4">{estat.quantidade_usos}</td>
                                                <td className="py-3 px-4">
                                                    {estat.categoria_mais_frequente === 7 ? 'Autopeças' : estat.categoria_mais_frequente}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Histórico Recente */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Histórico Recente (Últimos 30 dias)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">
                                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                                <p className="text-gray-500 mt-2">Carregando histórico...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium">Data</th>
                                            <th className="text-left py-3 px-4 font-medium">Transportadora</th>
                                            <th className="text-left py-3 px-4 font-medium">Valor</th>
                                            <th className="text-left py-3 px-4 font-medium">Prazo</th>
                                            <th className="text-left py-3 px-4 font-medium">Origem</th>
                                            <th className="text-left py-3 px-4 font-medium">Destino</th>
                                            <th className="text-left py-3 px-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historicoRecente.map((item) => (
                                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{formatarData(item.data_calculo)}</td>
                                                <td className="py-3 px-4 font-medium">{item.transportadora}</td>
                                                <td className="py-3 px-4">{formatarValor(item.valor_frete)}</td>
                                                <td className="py-3 px-4">{item.prazo_entrega} dias</td>
                                                <td className="py-3 px-4">{item.cep_origem}</td>
                                                <td className="py-3 px-4">{item.cep_destino}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.sucesso
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {item.sucesso ? 'Sucesso' : 'Erro'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </LayoutGestor>
    );
} 