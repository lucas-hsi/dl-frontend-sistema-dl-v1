import LayoutVendedor from '@/components/layout/LayoutVendedor';
import {
    ClienteVendaRapida,
    DadosPagamento,
    ItemCarrinho,
    ProdutoVendaRapida,
    vendaRapidaService
} from '@/services/vendaRapidaService';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    DollarSign,
    Minus,
    Package,
    Plus,
    Search,
    ShoppingCart,
    Trash2,
    TrendingUp,
    User,
    Users,
    X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import ClientProfileBadge from '../../components/ui/ClientProfileBadge';
import PaymentIcon from '../../components/ui/PaymentIcons';

interface ResumoBalcao {
    vendas_hoje: {
        total: number;
        valor_total: number;
        ticket_medio: number;
    };
    alertas: {
        produtos_estoque_baixo: number;
        produtos_criticos: any[];
    };
    ultima_atualizacao: string;
}

const VendaRapidaPage: React.FC = () => {
    // Estados principais
    const [step, setStep] = useState<'produtos' | 'cliente' | 'pagamento' | 'finalizado'>('produtos');
    const [loading, setLoading] = useState(false);
    const [resumoBalcao, setResumoBalcao] = useState<ResumoBalcao | null>(null);

    // Estados dos produtos
    const [termoBusca, setTermoBusca] = useState('');
    const [produtos, setProdutos] = useState<ProdutoVendaRapida[]>([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoVendaRapida[]>([]);
    const [buscandoProdutos, setBuscandoProdutos] = useState(false);
    const [mostrarResultados, setMostrarResultados] = useState(false);

    // Estados para produto avulso rápido
    const [modalProdutoAvulso, setModalProdutoAvulso] = useState(false);
    const [produtoAvulsoData, setProdutoAvulsoData] = useState({
        nome: '',
        marca: '',
        categoria: '',
        preco: 0,
        precoString: '', // Novo campo para string do preço
        descricao: '',
        observacoes: ''
    });

    // Estados para solicitação de desconto
    const [modalSolicitacaoDesconto, setModalSolicitacaoDesconto] = useState(false);
    const [itemParaDesconto, setItemParaDesconto] = useState<{ index: number, item: ItemCarrinho } | null>(null);
    const [solicitacaoDesconto, setSolicitacaoDesconto] = useState({
        desconto_solicitado: 0,
        motivo_vendedor: '',
        observacoes_vendedor: ''
    });

    // Estados para desconto geral com autorização
    const [descontoPrecisaAutorizacao, setDescontoPrecisaAutorizacao] = useState(false);
    const [modalAutorizacaoDesconto, setModalAutorizacaoDesconto] = useState(false);

    // Estados do carrinho
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [descontoGeral, setDescontoGeral] = useState(0);
    const [frete, setFrete] = useState(0);

    // Estados do cliente
    const [cliente, setCliente] = useState<ClienteVendaRapida | null>(null);
    const [telefoneCliente, setTelefoneCliente] = useState('');
    const [buscandoCliente, setBuscandoCliente] = useState(false);
    const [novoCliente, setNovoCliente] = useState({
        nome: '',
        telefone: '',
        email: '',
        cidade: '',
        tipo: 'consumidor_final' as 'latoeiro' | 'mecanico' | 'consumidor_final'
    });

    // Estados do pagamento
    const [dadosPagamento, setDadosPagamento] = useState<DadosPagamento>({
        forma_pagamento: 'dinheiro',
        valor_pago: 0,
        troco: 0,
        numero_parcelas: 1,
        taxa_juros: 0,
        referencia_pagamento: '',
        observacoes_pagamento: ''
    });

    // Estados para formas de pagamento
    const [mostrarFormasPagamento, setMostrarFormasPagamento] = useState(false);
    const [pagamentoCalculado, setPagamentoCalculado] = useState<any>(null);

    // Estados da venda finalizada
    const [vendaFinalizada, setVendaFinalizada] = useState<any>(null);

    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Função utilitária para formatar preço
    const formatarPrecoInput = (valor: string): string => {
        // Remove tudo exceto números, vírgula e ponto
        let limpo = valor.replace(/[^\d.,]/g, '');

        // Substitui vírgula por ponto para validação
        const comPonto = limpo.replace(',', '.');

        // Verifica se é um número válido
        if (comPonto && !isNaN(parseFloat(comPonto))) {
            // Se for válido, mantém o formato original do usuário
            return limpo;
        }

        return limpo;
    };

    // Função para converter string de preço para número
    const converterPrecoParaNumero = (valorString: string): number => {
        if (!valorString) return 0;
        const valorComPonto = valorString.replace(',', '.');
        return parseFloat(valorComPonto) || 0;
    };

    // Carregar resumo do balcão
    const carregarResumoBalcao = async () => {
        try {
            const resumo = await vendaRapidaService.obterResumoBalcao();

            // Validar estrutura do resumo antes de definir
            if (resumo && typeof resumo === 'object') {
                // Validar vendas_hoje
                const vendasHoje = resumo.vendas_hoje;
                if (!vendasHoje || typeof vendasHoje !== 'object') {
                    console.error('Estrutura vendas_hoje inválida:', vendasHoje);
                    setResumoBalcao(null);
                    return;
                }

                // Validar alertas
                const alertas = resumo.alertas;
                if (!alertas || typeof alertas !== 'object') {
                    console.error('Estrutura alertas inválida:', alertas);
                    setResumoBalcao(null);
                    return;
                }

                const resumoValidado: ResumoBalcao = {
                    vendas_hoje: {
                        total: typeof vendasHoje.total === 'number' ? vendasHoje.total : 0,
                        valor_total: typeof vendasHoje.valor_total === 'number' ? vendasHoje.valor_total : 0,
                        ticket_medio: typeof vendasHoje.ticket_medio === 'number' ? vendasHoje.ticket_medio : 0
                    },
                    alertas: {
                        produtos_estoque_baixo: typeof alertas.produtos_estoque_baixo === 'number' ? alertas.produtos_estoque_baixo : 0,
                        produtos_criticos: Array.isArray(alertas.produtos_criticos) ? alertas.produtos_criticos : []
                    },
                    ultima_atualizacao: resumo.ultima_atualizacao || new Date().toISOString()
                };
                setResumoBalcao(resumoValidado);
            } else {
                console.error('Resumo inválido recebido:', resumo);
                setResumoBalcao(null);
            }
        } catch (error) {
            console.error('Erro ao carregar resumo:', error);
            setResumoBalcao(null);
        }
    };

    // Buscar produtos em tempo real
    const buscarProdutos = async () => {
        if (!termoBusca.trim()) {
            setProdutosFiltrados([]);
            setMostrarResultados(false);
            return;
        }

        setBuscandoProdutos(true);
        try {
            const resultado = await vendaRapidaService.buscarProdutos(termoBusca, 10);

            // Validar resultado
            if (!Array.isArray(resultado)) {
                console.error('Resultado da busca não é um array:', resultado);
                setProdutosFiltrados([]);
                setMostrarResultados(true);
                return;
            }

            // Validar cada produto
            const produtosValidados = resultado.filter(produto => {
                if (!produto || typeof produto !== 'object') {
                    console.warn('Produto inválido encontrado:', produto);
                    return false;
                }

                // Validar campos obrigatórios
                if (!produto.id || !produto.nome) {
                    console.warn('Produto sem ID ou nome:', produto);
                    return false;
                }

                // Validar preço
                if (typeof produto.preco !== 'number' || isNaN(produto.preco) || produto.preco < 0) {
                    console.warn('Preço inválido do produto:', produto);
                    return false;
                }

                return true;
            });

            setProdutosFiltrados(produtosValidados);
            setMostrarResultados(true);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            toast.error('Erro ao buscar produtos');
            setProdutosFiltrados([]);
            setMostrarResultados(true);
        } finally {
            setBuscandoProdutos(false);
        }
    };

    // Debounce para busca em tempo real
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            buscarProdutos();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [termoBusca]);

    // Carregar dados iniciais
    useEffect(() => {
        carregarResumoBalcao();
    }, []);

    const adicionarAoCarrinho = (produto: ProdutoVendaRapida) => {
        // Validar dados do produto
        if (!produto || !produto.id || !produto.nome) {
            console.error('Produto inválido:', produto);
            toast.error('Produto inválido');
            return;
        }

        // Validar preço
        const precoValido = typeof produto.preco === 'number' && !isNaN(produto.preco) ? produto.preco : 0;
        if (precoValido <= 0) {
            toast.error('Preço do produto inválido');
            return;
        }

        const itemExistente = carrinho.find(item => item.produto_id === produto.id);

        if (itemExistente) {
            setCarrinho(carrinho.map(item =>
                item.produto_id === produto.id
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            ));
        } else {
            const novoItem: ItemCarrinho = {
                tipo_produto: 'cadastrado',
                produto_id: produto.id,
                produto_nome: produto.nome || 'Produto sem nome',
                produto_sku: produto.sku || '',
                produto_marca: produto.marca || '',
                produto_categoria: produto.categoria || '',
                quantidade: 1,
                preco_unitario: precoValido,
                desconto_percentual: 0,
                desconto_valor: 0,
                observacoes: ''
            };
            setCarrinho([...carrinho, novoItem]);
        }

        setTermoBusca('');
        setMostrarResultados(false);
        toast.success(`${produto.nome} adicionado ao carrinho`);
    };

    const adicionarProdutoAvulso = () => {
        if (!produtoAvulsoData.nome || !produtoAvulsoData.preco) {
            toast.error('Nome e preço são obrigatórios');
            return;
        }

        const novoItem: ItemCarrinho = {
            tipo_produto: 'avulso',
            produto_nome: produtoAvulsoData.nome,
            produto_sku: '',
            produto_marca: produtoAvulsoData.marca,
            produto_categoria: produtoAvulsoData.categoria,
            quantidade: 1,
            preco_unitario: produtoAvulsoData.preco,
            desconto_percentual: 0,
            desconto_valor: 0,
            observacoes: produtoAvulsoData.observacoes
        };

        setCarrinho([...carrinho, novoItem]);
        setProdutoAvulsoData({
            nome: '',
            marca: '',
            categoria: '',
            preco: 0,
            precoString: '',
            descricao: '',
            observacoes: ''
        });
        toast.success('Produto avulso adicionado ao carrinho');
    };

    const atualizarItemCarrinho = (index: number, campo: keyof ItemCarrinho, valor: any) => {
        const novoCarrinho = [...carrinho];
        novoCarrinho[index] = { ...novoCarrinho[index], [campo]: valor };
        setCarrinho(novoCarrinho);
    };

    const removerDoCarrinho = (index: number) => {
        setCarrinho(carrinho.filter((_, i) => i !== index));
    };

    const calcularTotais = () => {
        return vendaRapidaService.calcularTotaisCarrinho(carrinho, descontoGeral, frete);
    };

    const buscarCliente = async () => {
        if (!telefoneCliente.trim()) {
            toast.error('Digite o telefone do cliente');
            return;
        }

        setBuscandoCliente(true);
        try {
            console.log('🔍 Buscando cliente com telefone:', telefoneCliente);
            const resultado = await vendaRapidaService.buscarCliente(telefoneCliente);
            console.log('📦 Resultado da busca:', resultado);
            console.log('📦 Tipo do resultado:', typeof resultado);
            console.log('📦 Tipo do cliente:', typeof resultado.cliente);
            console.log('📦 Cliente:', resultado.cliente);

            // Validar estrutura do resultado
            if (!resultado || typeof resultado !== 'object') {
                throw new Error('Resposta inválida do servidor');
            }

            if (resultado.encontrado === true) {
                // Validar dados do cliente
                if (!resultado.cliente || typeof resultado.cliente !== 'object') {
                    throw new Error('Dados do cliente inválidos');
                }

                const cliente = resultado.cliente;
                if (!cliente.id || !cliente.nome || !cliente.telefone) {
                    throw new Error('Dados obrigatórios do cliente não encontrados');
                }

                setCliente(cliente);
                toast.success('Cliente encontrado!');
            } else {
                setCliente(null);
                toast('Cliente não encontrado. Você pode criar um novo.');
            }
        } catch (error) {
            console.error('❌ Erro ao buscar cliente:', error);
            toast.error('Erro ao buscar cliente');
            setCliente(null);
        } finally {
            setBuscandoCliente(false);
        }
    };

    const criarNovoCliente = async () => {
        if (!novoCliente.nome || !novoCliente.telefone) {
            toast.error('Nome e telefone são obrigatórios');
            return;
        }

        try {
            const clienteCriado = await vendaRapidaService.criarClienteRapido(novoCliente);
            setCliente(clienteCriado);
            setTelefoneCliente(clienteCriado.telefone);
            toast.success('Cliente criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            toast.error('Erro ao criar cliente');
        }
    };

    const finalizarVenda = async () => {
        if (carrinho.length === 0) {
            toast.error('Adicione produtos ao carrinho');
            return;
        }

        if (!cliente) {
            toast.error('Selecione ou crie um cliente');
            return;
        }

        // Verificar se desconto precisa de autorização
        if (descontoPrecisaAutorizacao) {
            toast.error('Desconto acima de 10% requer autorização do gestor. Entre em contato.');
            return;
        }

        setLoading(true);
        try {
            // DEBUG: Log do carrinho antes do envio
            console.log('🛒 Carrinho antes do envio:', carrinho);
            console.log('🛒 Tamanho do carrinho:', carrinho.length);
            console.log('🛒 Estrutura do primeiro item:', carrinho[0]);

            const vendaData = {
                cliente_id: cliente.id!,
                vendedor_id: 1, // TODO: pegar do contexto de auth
                observacoes: '',
                desconto_geral_percentual: descontoGeral,
                desconto_geral_valor: 0,
                frete_valor: frete,
                frete_tipo: 'entrega',
                endereco_entrega: null,
                produtos: carrinho, // ✅ CORRIGIDO: enviando como 'produtos' em vez de 'itens'
                itens: carrinho, // ✅ ADICIONADO: campo 'itens' para compatibilidade
                forma_pagamento: dadosPagamento.forma_pagamento, // ✅ ADICIONADO: forma de pagamento
                dados_pagamento: dadosPagamento,
                finalizar_imediatamente: true
            };

            console.log('📤 Dados da venda sendo enviados:', vendaData);

            const resultado = await vendaRapidaService.finalizarVenda(vendaData);
            setVendaFinalizada(resultado);
            setStep('finalizado');
            toast.success('Venda finalizada com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao finalizar venda:', error);
            toast.error('Erro ao finalizar venda');
        } finally {
            setLoading(false);
        }
    };

    const solicitarDescontoEspecial = (index: number, item: ItemCarrinho) => {
        setItemParaDesconto({ index, item });
        setSolicitacaoDesconto({
            desconto_solicitado: item.desconto_percentual,
            motivo_vendedor: '',
            observacoes_vendedor: ''
        });
        setModalSolicitacaoDesconto(true);
    };

    const enviarSolicitacaoDesconto = async () => {
        if (!itemParaDesconto) return;

        setLoading(true);
        try {
            // TODO: Implementar envio da solicitação
            toast.success('Solicitação de desconto enviada!');
            setModalSolicitacaoDesconto(false);
        } catch (error) {
            toast.error('Erro ao enviar solicitação');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calcularJurosPagamento = (valor: number, formaPagamento: string, parcelas: number = 1) => {
        const totais = calcularTotais();
        const valorTotal = totais.total;

        switch (formaPagamento) {
            case 'pix':
            case 'cartao_debito':
                return {
                    valor_original: valorTotal,
                    parcelas: 1,
                    taxa_juros: 0,
                    valor_parcela: valorTotal,
                    valor_total: valorTotal,
                    total_juros: 0
                };
            case 'cartao_credito':
                // Tabela de juros do cartão de crédito
                const taxasJuros = {
                    1: 0,    // À vista sem juros
                    2: 2.5,  // 2x com 2.5% de juros
                    3: 5.0,  // 3x com 5% de juros
                    4: 7.5,  // 4x com 7.5% de juros
                    5: 10.0, // 5x com 10% de juros
                    6: 12.5  // 6x com 12.5% de juros
                };

                const taxa = taxasJuros[parcelas as keyof typeof taxasJuros] || 0;
                const juros = valorTotal * (taxa / 100);
                const valorComJuros = valorTotal + juros;
                const valorParcela = valorComJuros / parcelas;

                return {
                    valor_original: valorTotal,
                    parcelas: parcelas,
                    taxa_juros: taxa,
                    valor_parcela: valorParcela,
                    valor_total: valorComJuros,
                    total_juros: juros
                };
            case 'dinheiro':
            case 'transferencia':
            case 'fiado':
            case 'vale_peca':
            default:
                return {
                    valor_original: valorTotal,
                    parcelas: 1,
                    taxa_juros: 0,
                    valor_parcela: valorTotal,
                    valor_total: valorTotal,
                    total_juros: 0
                };
        }
    };

    const resetarVenda = () => {
        setStep('produtos');
        setCarrinho([]);
        setCliente(null);
        setTelefoneCliente('');
        setNovoCliente({ nome: '', telefone: '', email: '', cidade: '', tipo: 'consumidor_final' });
        setProdutoAvulsoData({
            nome: '',
            marca: '',
            categoria: '',
            preco: 0,
            precoString: '',
            descricao: '',
            observacoes: ''
        });
        setDadosPagamento({
            forma_pagamento: 'dinheiro',
            valor_pago: 0,
            troco: 0,
            numero_parcelas: 1,
            taxa_juros: 0,
            referencia_pagamento: '',
            observacoes_pagamento: ''
        });
        setVendaFinalizada(null);
        setDescontoGeral(0);
        setFrete(0);
    };

    const totais = calcularTotais();

    return (
        <LayoutVendedor>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Premium com Card Degrade */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl rounded-3xl">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="text-white">
                                <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                                    <ShoppingCart className="text-yellow-300" size={32} />
                                    Venda Rápida
                                </h1>
                                <p className="text-blue-100 text-lg">Sistema inteligente para vendas eficientes</p>
                            </div>

                            {resumoBalcao && (
                                <div className="flex gap-8">
                                    <div className="text-center text-white">
                                        <div className="text-3xl font-bold text-yellow-300 flex items-center gap-2">
                                            <TrendingUp size={24} />
                                            {resumoBalcao.vendas_hoje.total}
                                        </div>
                                        <div className="text-blue-100">Vendas Hoje</div>
                                    </div>
                                    <div className="text-center text-white">
                                        <div className="text-3xl font-bold text-green-300 flex items-center gap-2">
                                            <DollarSign size={24} />
                                            {vendaRapidaService.formatarMoeda(resumoBalcao.vendas_hoje.valor_total)}
                                        </div>
                                        <div className="text-blue-100">Faturamento</div>
                                    </div>
                                    <div className="text-center text-white">
                                        <div className="text-3xl font-bold text-purple-300 flex items-center gap-2">
                                            <Users size={24} />
                                            {vendaRapidaService.formatarMoeda(resumoBalcao.vendas_hoje.ticket_medio)}
                                        </div>
                                        <div className="text-blue-100">Ticket Médio</div>
                                    </div>
                                    {resumoBalcao.alertas.produtos_estoque_baixo > 0 && (
                                        <div className="text-center text-white">
                                            <div className="text-3xl font-bold text-red-300 flex items-center gap-2">
                                                <AlertTriangle size={24} />
                                                {resumoBalcao.alertas.produtos_estoque_baixo}
                                            </div>
                                            <div className="text-blue-100">Estoque Baixo</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Coluna Principal - Produtos e Busca */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Busca de Produtos Premium */}
                            <motion.div
                                className="bg-white rounded-2xl shadow-xl border-0 p-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                                    <Search className="text-blue-600" size={28} />
                                    Buscar Produtos
                                </h2>

                                <div className="flex gap-4 mb-6">
                                    <div className="flex-1 relative">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Digite SKU, nome ou categoria do produto..."
                                            value={termoBusca}
                                            onChange={(e) => setTermoBusca(e.target.value)}
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg transition-all"
                                        />
                                        {buscandoProdutos && (
                                            <div className="absolute right-4 top-4">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setModalProdutoAvulso(true)}
                                        className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-3 font-semibold shadow-lg"
                                    >
                                        <Package size={20} />
                                        Produto Avulso
                                    </button>
                                </div>

                                {/* Resultados da busca em tempo real */}
                                <AnimatePresence>
                                    {mostrarResultados && produtosFiltrados.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-3 max-h-96 overflow-y-auto"
                                        >
                                            {produtosFiltrados.map((produto) => (
                                                <motion.div
                                                    key={produto.id}
                                                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${produto.estoque_critico
                                                        ? 'border-red-200 bg-red-50 hover:border-red-300'
                                                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                                        }`}
                                                    onClick={() => adicionarAoCarrinho(produto)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-lg font-semibold text-gray-900">{produto.nome}</h3>
                                                                {produto.estoque_critico && (
                                                                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full font-medium">
                                                                        Estoque Baixo
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-600 mb-3">
                                                                <span className="font-medium">SKU:</span> {produto.sku} |
                                                                <span className="font-medium"> Marca:</span> {produto.marca} |
                                                                <span className="font-medium"> Categoria:</span> {produto.categoria}
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                <span className="text-2xl font-bold text-green-600">
                                                                    {vendaRapidaService.formatarMoeda(produto.preco)}
                                                                </span>
                                                                <span className={`text-sm font-medium ${produto.estoque_disponivel > 10 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    Estoque: {produto.estoque_disponivel}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Plus className="text-blue-600" size={28} />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Mensagem quando não há resultados */}
                                {mostrarResultados && produtosFiltrados.length === 0 && termoBusca && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg">Nenhum produto encontrado</p>
                                        <p className="text-sm">Tente buscar por outro termo ou adicione um produto avulso</p>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Seção do Cliente */}
                            <motion.div
                                className="bg-white rounded-2xl shadow-xl border-0 p-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                                    <User className="text-blue-600" size={28} />
                                    Cliente
                                </h2>

                                {!cliente ? (
                                    <div className="space-y-6">
                                        {/* Busca de Cliente */}
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Telefone do cliente"
                                                    value={telefoneCliente}
                                                    onChange={(e) => setTelefoneCliente(e.target.value)}
                                                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg"
                                                />
                                            </div>
                                            <button
                                                onClick={buscarCliente}
                                                disabled={buscandoCliente}
                                                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                                            >
                                                {buscandoCliente ? 'Buscando...' : 'Buscar'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setNovoCliente({ ...novoCliente, telefone: telefoneCliente });
                                                    setTelefoneCliente('');
                                                }}
                                                className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
                                            >
                                                Criar Novo
                                            </button>
                                        </div>

                                        {/* Formulário de Novo Cliente */}
                                        {novoCliente.telefone && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="bg-gray-50 rounded-xl p-6"
                                            >
                                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados do Novo Cliente</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Nome completo"
                                                        value={novoCliente.nome}
                                                        onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Telefone"
                                                        value={novoCliente.telefone}
                                                        onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
                                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <input
                                                        type="email"
                                                        placeholder="Email (opcional)"
                                                        value={novoCliente.email}
                                                        onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
                                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <select
                                                        value={novoCliente.tipo}
                                                        onChange={(e) => setNovoCliente({ ...novoCliente, tipo: e.target.value as 'latoeiro' | 'mecanico' | 'consumidor_final' })}
                                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="consumidor_final">Consumidor Final</option>
                                                        <option value="mecanico">Mecânico</option>
                                                        <option value="latoeiro">Latoeiro</option>
                                                    </select>
                                                </div>
                                                <div className="flex gap-3 mt-4">
                                                    <button
                                                        onClick={criarNovoCliente}
                                                        disabled={!novoCliente.nome || !novoCliente.telefone}
                                                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                                    >
                                                        Criar Cliente
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setNovoCliente({ nome: '', telefone: '', email: '', cidade: '', tipo: 'consumidor_final' });
                                                            setTelefoneCliente('');
                                                        }}
                                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-green-800">{cliente.nome}</h3>
                                                    <ClientProfileBadge tipo="consumidor_final" />
                                                </div>
                                                <p className="text-green-600">{cliente.telefone}</p>
                                                {cliente.email && <p className="text-green-600">{cliente.email}</p>}
                                            </div>
                                            <CheckCircle className="text-green-600" size={32} />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Sidebar - Carrinho e Totais */}
                        <div className="space-y-6">
                            {/* Carrinho */}
                            <motion.div
                                className="bg-white rounded-2xl shadow-xl border-0 p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                                    <ShoppingCart className="text-blue-600" size={24} />
                                    Carrinho ({carrinho.length})
                                </h2>

                                {carrinho.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p>Carrinho vazio</p>
                                        <p className="text-sm">Adicione produtos para começar</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {carrinho.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                className="border border-gray-200 rounded-lg p-4"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-gray-900">{item.produto_nome}</h4>
                                                    <button
                                                        onClick={() => removerDoCarrinho(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="text-sm text-gray-600 mb-3">
                                                    {item.produto_sku && `SKU: ${item.produto_sku}`}
                                                    {item.produto_marca && ` | ${item.produto_marca}`}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => atualizarItemCarrinho(index, 'quantidade', Math.max(1, item.quantidade - 1))}
                                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="w-12 text-center font-semibold">{item.quantidade}</span>
                                                        <button
                                                            onClick={() => atualizarItemCarrinho(index, 'quantidade', item.quantidade + 1)}
                                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <span className="text-lg font-bold text-green-600">
                                                        {vendaRapidaService.formatarMoeda(item.preco_unitario * item.quantidade)}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Totais */}
                            <motion.div
                                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="text-xl font-bold mb-4">Resumo da Venda</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{vendaRapidaService.formatarMoeda(totais.subtotal)}</span>
                                    </div>

                                    {/* Sistema de Desconto */}
                                    <div className="border-t border-white/20 pt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span>Desconto Geral:</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={descontoGeral}
                                                    onChange={(e) => {
                                                        const valor = parseFloat(e.target.value) || 0;
                                                        if (valor <= 10) {
                                                            setDescontoGeral(valor);
                                                            setDescontoPrecisaAutorizacao(false);
                                                        } else {
                                                            setDescontoGeral(valor);
                                                            setDescontoPrecisaAutorizacao(true);
                                                            toast(`Desconto de ${valor}% requer autorização do gestor`, { icon: '⚠️' });
                                                        }
                                                    }}
                                                    className="w-20 px-2 py-1 text-center bg-white/20 rounded text-white placeholder-white/70"
                                                    placeholder="0"
                                                />
                                                <span>%</span>
                                            </div>
                                        </div>
                                        {descontoGeral > 0 && (
                                            <div className="text-sm text-blue-100">
                                                Valor do desconto: {vendaRapidaService.formatarMoeda(totais.subtotal * (descontoGeral / 100))}
                                                {descontoPrecisaAutorizacao && (
                                                    <div className="text-yellow-300 text-xs mt-1">
                                                        ⚠️ Requer autorização do gestor
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Frete:</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="CEP"
                                                className="w-20 px-2 py-1 text-center bg-white/20 rounded text-white placeholder-white/70 text-sm"
                                                maxLength={9}
                                                onChange={(e) => {
                                                    const cep = e.target.value.replace(/\D/g, '');
                                                    if (cep.length === 8) {
                                                        // TODO: Implementar cálculo de frete
                                                        setFrete(15.90); // Valor simulado
                                                        toast.success('Frete calculado: R$ 15,90');
                                                    }
                                                }}
                                            />
                                            <span>{vendaRapidaService.formatarMoeda(totais.frete)}</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-white/20 pt-3">
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total:</span>
                                            <span>{vendaRapidaService.formatarMoeda(totais.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {descontoPrecisaAutorizacao ? (
                                    <div className="space-y-3 mt-6">
                                        <button
                                            onClick={() => setModalAutorizacaoDesconto(true)}
                                            className="w-full py-4 bg-yellow-500 text-white rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors"
                                        >
                                            Solicitar Autorização do Gestor
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDescontoGeral(10);
                                                setDescontoPrecisaAutorizacao(false);
                                                toast.success('Desconto ajustado para 10%');
                                            }}
                                            className="w-full py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                                        >
                                            Usar Desconto de 10%
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            const calculo = calcularJurosPagamento(totais.total, dadosPagamento.forma_pagamento, dadosPagamento.numero_parcelas);
                                            setPagamentoCalculado(calculo);
                                            setMostrarFormasPagamento(true);
                                        }}
                                        disabled={loading || carrinho.length === 0 || !cliente}
                                        className="w-full mt-6 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        data-qa="vendas-Finalizar"
                                    >
                                        {loading ? 'Finalizando...' : 'Finalizar Venda'}
                                    </button>
                                )}

                                {/* Ícones de Formas de Pagamento Rápidas */}
                                {carrinho.length > 0 && cliente && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Formas de Pagamento</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Dinheiro */}
                                            <PaymentIcon
                                                type="dinheiro"
                                                selected={dadosPagamento.forma_pagamento === 'dinheiro'}
                                                onClick={() => {
                                                    setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'dinheiro' });
                                                    const calculo = calcularJurosPagamento(totais.total, 'dinheiro');
                                                    setPagamentoCalculado(calculo);
                                                }}
                                                label="Dinheiro"
                                                description="Sem juros"
                                            />

                                            {/* PIX */}
                                            <PaymentIcon
                                                type="pix"
                                                selected={dadosPagamento.forma_pagamento === 'pix'}
                                                onClick={() => {
                                                    setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'pix' });
                                                    const calculo = calcularJurosPagamento(totais.total, 'pix');
                                                    setPagamentoCalculado(calculo);
                                                }}
                                                label="PIX"
                                                description="Sem juros"
                                            />

                                            {/* Cartão de Débito */}
                                            <PaymentIcon
                                                type="cartao_debito"
                                                selected={dadosPagamento.forma_pagamento === 'cartao_debito'}
                                                onClick={() => {
                                                    setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'cartao_debito' });
                                                    const calculo = calcularJurosPagamento(totais.total, 'cartao_debito');
                                                    setPagamentoCalculado(calculo);
                                                }}
                                                label="Débito"
                                                description="Sem juros"
                                            />

                                            {/* Cartão de Crédito */}
                                            <PaymentIcon
                                                type="cartao_credito"
                                                selected={dadosPagamento.forma_pagamento === 'cartao_credito'}
                                                onClick={() => {
                                                    setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'cartao_credito' });
                                                    const calculo = calcularJurosPagamento(totais.total, 'cartao_credito', dadosPagamento.numero_parcelas);
                                                    setPagamentoCalculado(calculo);
                                                }}
                                                label="Crédito"
                                                description="Com juros"
                                            />

                                            {/* Transferência */}
                                            <PaymentIcon
                                                type="transferencia"
                                                selected={dadosPagamento.forma_pagamento === 'transferencia'}
                                                onClick={() => {
                                                    setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'transferencia' });
                                                    const calculo = calcularJurosPagamento(totais.total, 'transferencia');
                                                    setPagamentoCalculado(calculo);
                                                }}
                                                label="Transferência"
                                                description="Sem juros"
                                            />

                                            {/* Fiado */}
                                            <PaymentIcon
                                                type="fiado"
                                                selected={dadosPagamento.forma_pagamento === 'fiado'}
                                                onClick={() => {
                                                    setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'fiado' });
                                                    const calculo = calcularJurosPagamento(totais.total, 'fiado');
                                                    setPagamentoCalculado(calculo);
                                                }}
                                                label="Fiado"
                                                description="Sem juros"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Produto Avulso */}
            <AnimatePresence>
                {modalProdutoAvulso && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setModalProdutoAvulso(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Produto Avulso</h3>
                                <button
                                    onClick={() => setModalProdutoAvulso(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nome do produto"
                                    value={produtoAvulsoData.nome}
                                    onChange={(e) => setProdutoAvulsoData({ ...produtoAvulsoData, nome: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Marca"
                                    value={produtoAvulsoData.marca}
                                    onChange={(e) => setProdutoAvulsoData({ ...produtoAvulsoData, marca: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Categoria"
                                    value={produtoAvulsoData.categoria}
                                    onChange={(e) => setProdutoAvulsoData({ ...produtoAvulsoData, categoria: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Preço (ex: 89,90 ou 89.90)"
                                    value={produtoAvulsoData.precoString}
                                    onChange={(e) => {
                                        const valorFormatado = formatarPrecoInput(e.target.value);
                                        const precoNumerico = converterPrecoParaNumero(valorFormatado);

                                        setProdutoAvulsoData({
                                            ...produtoAvulsoData,
                                            preco: precoNumerico,
                                            precoString: valorFormatado
                                        });
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea
                                    placeholder="Observações"
                                    value={produtoAvulsoData.observacoes}
                                    onChange={(e) => setProdutoAvulsoData({ ...produtoAvulsoData, observacoes: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setModalProdutoAvulso(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        adicionarProdutoAvulso();
                                        setModalProdutoAvulso(false);
                                    }}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Solicitação de Desconto */}
            <AnimatePresence>
                {modalSolicitacaoDesconto && itemParaDesconto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setModalSolicitacaoDesconto(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Solicitar Desconto</h3>
                                <button
                                    onClick={() => setModalSolicitacaoDesconto(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Produto</label>
                                    <p className="text-gray-600">{itemParaDesconto.item.produto_nome}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Desconto (%)</label>
                                    <input
                                        type="number"
                                        value={solicitacaoDesconto.desconto_solicitado}
                                        onChange={(e) => setSolicitacaoDesconto({ ...solicitacaoDesconto, desconto_solicitado: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Motivo</label>
                                    <textarea
                                        value={solicitacaoDesconto.motivo_vendedor}
                                        onChange={(e) => setSolicitacaoDesconto({ ...solicitacaoDesconto, motivo_vendedor: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Observações</label>
                                    <textarea
                                        value={solicitacaoDesconto.observacoes_vendedor}
                                        onChange={(e) => setSolicitacaoDesconto({ ...solicitacaoDesconto, observacoes_vendedor: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setModalSolicitacaoDesconto(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={enviarSolicitacaoDesconto}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Enviar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Autorização do Gestor */}
            <AnimatePresence>
                {modalAutorizacaoDesconto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setModalAutorizacaoDesconto(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Autorização do Gestor</h3>
                                <button
                                    onClick={() => setModalAutorizacaoDesconto(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <span className="text-yellow-600 text-2xl mr-2">⚠️</span>
                                        <div>
                                            <h4 className="font-semibold text-yellow-800">Desconto Especial</h4>
                                            <p className="text-yellow-700 text-sm">
                                                Você está solicitando um desconto de <strong>{descontoGeral}%</strong>
                                                que está acima do limite de 10% para vendedores.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Motivo do Desconto</label>
                                        <textarea
                                            placeholder="Explique o motivo do desconto especial..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Observações</label>
                                        <textarea
                                            placeholder="Informações adicionais..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-800 mb-2">Próximos Passos:</h4>
                                    <ol className="text-blue-700 text-sm space-y-1">
                                        <li>1. Preencha o motivo do desconto</li>
                                        <li>2. Envie a solicitação para o gestor</li>
                                        <li>3. Aguarde a autorização</li>
                                        <li>4. Finalize a venda após aprovação</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setModalAutorizacaoDesconto(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        toast.success('Solicitação enviada para o gestor');
                                        setModalAutorizacaoDesconto(false);
                                    }}
                                    className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                >
                                    Enviar Solicitação
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Formas de Pagamento */}
            <AnimatePresence>
                {mostrarFormasPagamento && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setMostrarFormasPagamento(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Formas de Pagamento</h3>
                                <button
                                    onClick={() => setMostrarFormasPagamento(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Resumo da Venda */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-800 mb-2">Resumo da Venda</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>{vendaRapidaService.formatarMoeda(totais.subtotal)}</span>
                                        </div>
                                        {descontoGeral > 0 && (
                                            <div className="flex justify-between">
                                                <span>Desconto ({descontoGeral}%):</span>
                                                <span>-{vendaRapidaService.formatarMoeda(totais.desconto_geral)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>Frete:</span>
                                            <span>{vendaRapidaService.formatarMoeda(totais.frete)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-blue-800">
                                            <span>Total:</span>
                                            <span>{vendaRapidaService.formatarMoeda(totais.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Formas de Pagamento */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-800">Selecione a Forma de Pagamento</h4>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Dinheiro */}
                                        <PaymentIcon
                                            type="dinheiro"
                                            selected={dadosPagamento.forma_pagamento === 'dinheiro'}
                                            onClick={() => {
                                                setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'dinheiro' });
                                                const calculo = calcularJurosPagamento(totais.total, 'dinheiro');
                                                setPagamentoCalculado(calculo);
                                            }}
                                            label="Dinheiro"
                                            description="Sem juros"
                                        />

                                        {/* PIX */}
                                        <PaymentIcon
                                            type="pix"
                                            selected={dadosPagamento.forma_pagamento === 'pix'}
                                            onClick={() => {
                                                setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'pix' });
                                                const calculo = calcularJurosPagamento(totais.total, 'pix');
                                                setPagamentoCalculado(calculo);
                                            }}
                                            label="PIX"
                                            description="Sem juros"
                                        />

                                        {/* Cartão de Débito */}
                                        <PaymentIcon
                                            type="cartao_debito"
                                            selected={dadosPagamento.forma_pagamento === 'cartao_debito'}
                                            onClick={() => {
                                                setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'cartao_debito' });
                                                const calculo = calcularJurosPagamento(totais.total, 'cartao_debito');
                                                setPagamentoCalculado(calculo);
                                            }}
                                            label="Débito"
                                            description="Sem juros"
                                        />

                                        {/* Cartão de Crédito */}
                                        <PaymentIcon
                                            type="cartao_credito"
                                            selected={dadosPagamento.forma_pagamento === 'cartao_credito'}
                                            onClick={() => {
                                                setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'cartao_credito' });
                                                const calculo = calcularJurosPagamento(totais.total, 'cartao_credito', dadosPagamento.numero_parcelas);
                                                setPagamentoCalculado(calculo);
                                            }}
                                            label="Crédito"
                                            description="Com juros"
                                        />

                                        {/* Transferência */}
                                        <PaymentIcon
                                            type="transferencia"
                                            selected={dadosPagamento.forma_pagamento === 'transferencia'}
                                            onClick={() => {
                                                setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'transferencia' });
                                                const calculo = calcularJurosPagamento(totais.total, 'transferencia');
                                                setPagamentoCalculado(calculo);
                                            }}
                                            label="Transferência"
                                            description="Sem juros"
                                        />

                                        {/* Fiado */}
                                        <PaymentIcon
                                            type="fiado"
                                            selected={dadosPagamento.forma_pagamento === 'fiado'}
                                            onClick={() => {
                                                setDadosPagamento({ ...dadosPagamento, forma_pagamento: 'fiado' });
                                                const calculo = calcularJurosPagamento(totais.total, 'fiado');
                                                setPagamentoCalculado(calculo);
                                            }}
                                            label="Fiado"
                                            description="Sem juros"
                                        />
                                    </div>

                                    {/* Parcelas para Cartão de Crédito */}
                                    {dadosPagamento.forma_pagamento === 'cartao_credito' && (
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium mb-2">Número de Parcelas</label>
                                            <select
                                                value={dadosPagamento.numero_parcelas}
                                                onChange={(e) => {
                                                    const parcelas = parseInt(e.target.value);
                                                    setDadosPagamento({ ...dadosPagamento, numero_parcelas: parcelas });
                                                    const calculo = calcularJurosPagamento(totais.total, 'cartao_credito', parcelas);
                                                    setPagamentoCalculado(calculo);
                                                }}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value={1}>1x - À vista (sem juros)</option>
                                                <option value={2}>2x - Com 2.5% de juros</option>
                                                <option value={3}>3x - Com 5% de juros</option>
                                                <option value={4}>4x - Com 7.5% de juros</option>
                                                <option value={5}>5x - Com 10% de juros</option>
                                                <option value={6}>6x - Com 12.5% de juros</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Cálculo dos Juros */}
                                    {pagamentoCalculado && dadosPagamento.forma_pagamento === 'cartao_credito' && pagamentoCalculado.taxa_juros > 0 && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-yellow-800 mb-2">Cálculo dos Juros</h4>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Valor Original:</span>
                                                    <span>{vendaRapidaService.formatarMoeda(pagamentoCalculado.valor_original)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Taxa de Juros:</span>
                                                    <span>{pagamentoCalculado.taxa_juros}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Juros:</span>
                                                    <span>{vendaRapidaService.formatarMoeda(pagamentoCalculado.total_juros)}</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-yellow-800">
                                                    <span>Total com Juros:</span>
                                                    <span>{vendaRapidaService.formatarMoeda(pagamentoCalculado.valor_total)}</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-600">
                                                    <span>Valor da Parcela:</span>
                                                    <span>{vendaRapidaService.formatarMoeda(pagamentoCalculado.valor_parcela)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Campos Adicionais */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Valor Pago</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={dadosPagamento.valor_pago ?? ''}
                                                onChange={(e) => setDadosPagamento({ ...dadosPagamento, valor_pago: parseFloat(e.target.value) || 0 })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="0,00"
                                            />
                                        </div>

                                        {(dadosPagamento.valor_pago ?? 0) > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Troco</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={(dadosPagamento.valor_pago ?? 0) - (pagamentoCalculado?.valor_total || totais.total) || 0}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Observações</label>
                                            <textarea
                                                value={dadosPagamento.observacoes_pagamento}
                                                onChange={(e) => setDadosPagamento({ ...dadosPagamento, observacoes_pagamento: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                                placeholder="Observações sobre o pagamento..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setMostrarFormasPagamento(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        setMostrarFormasPagamento(false);
                                        finalizarVenda();
                                    }}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Finalizar Venda
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LayoutVendedor>
    );
};

export default VendaRapidaPage; 