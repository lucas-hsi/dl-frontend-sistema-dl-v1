import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Calendar, DollarSign, Download, FileText, Filter, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BalancoMensal, contabilidadeService, MovimentacaoCaixa, RelatorioContabilidade } from '../../../services/contabilidadeService';

export default function ContabilidadeRelatoriosPage() {
    const [activeTab, setActiveTab] = useState('geral');
    const [ano, setAno] = useState(new Date().getFullYear());
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [relatorioGeral, setRelatorioGeral] = useState<RelatorioContabilidade | null>(null);
    const [balancoMensal, setBalancoMensal] = useState<BalancoMensal | null>(null);
    const [movimentacoes, setMovimentacoes] = useState<MovimentacaoCaixa[]>([]);
    const [loading, setLoading] = useState(false);

    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        carregarDados();
    }, [ano, mes]);

    const carregarDados = async () => {
        setLoading(true);
        try {
            // Carregar relatório geral
            const geral = await contabilidadeService.gerarRelatorioContabilidade(ano, mes);
            setRelatorioGeral(geral);

            // Carregar balanço mensal
            const balanco = await contabilidadeService.gerarBalancoMensal(ano, mes);
            setBalancoMensal(balanco);

            // Carregar movimentações
            const dataInicio = `${ano}-${mes.toString().padStart(2, '0')}-01`;
            const dataFim = `${ano}-${mes.toString().padStart(2, '0')}-31`;
            const movs = await contabilidadeService.obterMovimentacoesCaixa(dataInicio, dataFim);
            setMovimentacoes(movs);

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (tipo: 'geral' | 'balanco' | 'movimentacoes') => {
        try {
            // Implementar download quando disponível
            console.log(`Download ${tipo} para ${mes}/${ano}`);
        } catch (error) {
            console.error('Erro ao baixar relatório:', error);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(2)}%`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">Relatórios Contábeis</h1>
                        <p className="text-blue-100">Análise financeira e relatórios contábeis da empresa</p>

                        {/* Filtros */}
                        <div className="flex flex-wrap items-center gap-4 mt-6">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-blue-200" />
                                <select
                                    value={mes}
                                    onChange={(e) => setMes(Number(e.target.value))}
                                    className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2"
                                >
                                    {meses.map((mesNome, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {mesNome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-blue-200" />
                                <select
                                    value={ano}
                                    onChange={(e) => setAno(Number(e.target.value))}
                                    className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2"
                                >
                                    {anos.map((ano) => (
                                        <option key={ano} value={ano}>
                                            {ano}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex space-x-1 mb-6">
                            {[
                                { id: 'geral', label: 'Relatório Geral', icon: FileText },
                                { id: 'balanco', label: 'Balanço Mensal', icon: BarChart3 },
                                { id: 'movimentacoes', label: 'Movimentações', icon: TrendingUp }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Conteúdo das Tabs */}
                        <div className="min-h-[400px]">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    {activeTab === 'geral' && relatorioGeral && (
                                        <motion.div
                                            key="geral"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-semibold">Relatório Geral - {meses[mes - 1]} {ano}</h3>
                                                <button
                                                    onClick={() => handleDownload('geral')}
                                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span>Baixar PDF</span>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-green-50 rounded-xl p-6">
                                                    <div className="flex items-center space-x-3">
                                                        <DollarSign className="w-8 h-8 text-green-600" />
                                                        <div>
                                                            <p className="text-2xl font-bold text-green-600">
                                                                {formatCurrency(relatorioGeral.receitas.total_receitas)}
                                                            </p>
                                                            <p className="text-sm text-green-600">Receitas</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-red-50 rounded-xl p-6">
                                                    <div className="flex items-center space-x-3">
                                                        <DollarSign className="w-8 h-8 text-red-600" />
                                                        <div>
                                                            <p className="text-2xl font-bold text-red-600">
                                                                {formatCurrency(relatorioGeral.despesas.total_despesas)}
                                                            </p>
                                                            <p className="text-sm text-red-600">Despesas</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50 rounded-xl p-6">
                                                    <div className="flex items-center space-x-3">
                                                        <TrendingUp className="w-8 h-8 text-blue-600" />
                                                        <div>
                                                            <p className="text-2xl font-bold text-blue-600">
                                                                {formatCurrency(relatorioGeral.resultado.lucro_liquido)}
                                                            </p>
                                                            <p className="text-sm text-blue-600">Lucro</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-white border rounded-xl p-6">
                                                    <h4 className="font-semibold mb-4">Impostos</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between">
                                                            <span>ICMS</span>
                                                            <span className="font-semibold">{formatCurrency(relatorioGeral.impostos.icms)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>PIS</span>
                                                            <span className="font-semibold">{formatCurrency(relatorioGeral.impostos.pis)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>COFINS</span>
                                                            <span className="font-semibold">{formatCurrency(relatorioGeral.impostos.cofins)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white border rounded-xl p-6">
                                                    <h4 className="font-semibold mb-4">Resumo</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between">
                                                            <span>Margem de Lucro</span>
                                                            <span className="font-semibold">{formatPercentage(relatorioGeral.resultado.margem_liquida)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Carga Tributária</span>
                                                            <span className="font-semibold">{formatPercentage(relatorioGeral.impostos.total_impostos / relatorioGeral.receitas.total_receitas * 100)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Vendas Brutas</span>
                                                            <span className="font-semibold">{formatCurrency(relatorioGeral.receitas.vendas_brutas)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'balanco' && balancoMensal && (
                                        <motion.div
                                            key="balanco"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-semibold">Balanço Mensal - {meses[mes - 1]} {ano}</h3>
                                                <button
                                                    onClick={() => handleDownload('balanco')}
                                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span>Baixar PDF</span>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-white border rounded-xl p-6">
                                                    <h4 className="font-semibold mb-4 text-green-600">Ativos</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between">
                                                            <span>Caixa e Bancos</span>
                                                            <span className="font-semibold">{formatCurrency(balancoMensal.ativo.circulante.caixa + balancoMensal.ativo.circulante.bancos)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Contas a Receber</span>
                                                            <span className="font-semibold">{formatCurrency(balancoMensal.ativo.circulante.contas_receber)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Estoque</span>
                                                            <span className="font-semibold">{formatCurrency(balancoMensal.ativo.circulante.estoque)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Ativos Fixos</span>
                                                            <span className="font-semibold">{formatCurrency(balancoMensal.ativo.nao_circulante.imobilizado)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white border rounded-xl p-6">
                                                    <h4 className="font-semibold mb-4 text-red-600">Passivos</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between">
                                                            <span>Contas a Pagar</span>
                                                            <span className="font-semibold">{formatCurrency(balancoMensal.passivo.circulante.fornecedores)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Impostos a Pagar</span>
                                                            <span className="font-semibold">{formatCurrency(balancoMensal.passivo.circulante.impostos_pagar)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Salários a Pagar</span>
                                                            <span className="font-semibold">{formatCurrency(balancoMensal.passivo.circulante.salarios_pagar)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Total Circulante</span>
                                                            <span className="font-semibold">{formatCurrency(balancoMensal.passivo.circulante.total_circulante)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white border rounded-xl p-6">
                                                <h4 className="font-semibold mb-4">Patrimônio Líquido</h4>
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {formatCurrency(balancoMensal.passivo.patrimonio_liquido.total_patrimonio)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'movimentacoes' && (
                                        <motion.div
                                            key="movimentacoes"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-semibold">Movimentações de Caixa - {meses[mes - 1]} {ano}</h3>
                                                <button
                                                    onClick={() => handleDownload('movimentacoes')}
                                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span>Baixar PDF</span>
                                                </button>
                                            </div>

                                            <div className="bg-white border rounded-xl overflow-hidden">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Data
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Descrição
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Tipo
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Valor
                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {movimentacoes.map((mov, index) => (
                                                                <tr key={index} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {new Date(mov.data).toLocaleDateString('pt-BR')}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                                        {mov.descricao}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${mov.tipo === 'entrada'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-red-100 text-red-800'
                                                                            }`}>
                                                                            {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                                                        </span>
                                                                    </td>
                                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                        {formatCurrency(mov.valor)}
                                                                    </td>

                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 