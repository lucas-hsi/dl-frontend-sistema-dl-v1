import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutGestor from "@/components/layout/LayoutGestor";
import { useAuth } from "@/contexts/AuthContext";
import { configuracaoService } from "@/services/configuracaoService";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Database,
  Edit,
  ExternalLink,
  Globe,
  Key,
  Plus,
  RefreshCw,
  Settings,
  TestTube,
  Trash2,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { api } from '@/config/api';

interface ConfiguracaoAPI {
  id: number;
  plataforma: string;
  nome_conta: string;
  access_token?: string;
  refresh_token?: string;
  client_id?: string;
  client_secret?: string;
  user_id?: string;
  nickname?: string;
  configuracoes?: any;
  ativo: boolean;
  ultima_sincronizacao?: string;
  ultimo_erro?: string;
  criado_em: string;
  atualizado_em: string;
}

interface ConfiguracaoPlataforma {
  id: number;
  plataforma: string;
  nome_exibicao: string;
  descricao?: string;
  api_base_url?: string;
  api_version?: string;
  documentacao_url?: string;
  ativo: boolean;
  em_desenvolvimento: boolean;
  sincronizacao_automatica: boolean;
  intervalo_sincronizacao: number;
  configuracoes?: any;
  criado_em: string;
  atualizado_em: string;
}

interface ConfiguracaoSistema {
  id: number;
  chave: string;
  valor?: string;
  tipo: string;
  descricao?: string;
  categoria?: string;
  criado_em: string;
  atualizado_em: string;
}

export default function ConfiguracoesPage() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Estados das configurações
  const [configuracoesAPI, setConfiguracoesAPI] = useState<ConfiguracaoAPI[]>([]);
  const [configuracoesPlataforma, setConfiguracoesPlataforma] = useState<ConfiguracaoPlataforma[]>([]);
  const [configuracoesSistema, setConfiguracoesSistema] = useState<ConfiguracaoSistema[]>([]);

  // Estados da interface
  const [activeTab, setActiveTab] = useState("apis");
  const [showNovoAPI, setShowNovoAPI] = useState(false);
  const [showNovoSistema, setShowNovoSistema] = useState(false);
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [key: string]: { type: 'success' | 'error', text: string } }>({});

  // Estados para formulários
  const [novaAPI, setNovaAPI] = useState({
    plataforma: "",
    nome_conta: "",
    access_token: "",
    client_id: "",
    client_secret: ""
  });

  const [novaConfigSistema, setNovaConfigSistema] = useState({
    chave: "",
    valor: "",
    tipo: "string",
    descricao: "",
    categoria: ""
  });

  // Carregar configurações reais
  const carregarConfiguracoes = async () => {
    try {
      setLoadingActions(prev => ({ ...prev, carregar: true }));
      
      const [apis, plataformas, sistema] = await Promise.all([
        api.get('/configuracoes/apis'),
        api.get('/configuracoes/plataformas'),
        api.get('/configuracoes/sistema')
      ]);

      setConfiguracoesAPI(apis.data || []);
      setConfiguracoesPlataforma(plataformas.data || []);
      setConfiguracoesSistema(sistema.data || []);
      
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoadingActions(prev => ({ ...prev, carregar: false }));
    }
  };

  const showMessage = (action: string, type: 'success' | 'error', text: string) => {
    setMessages(prev => ({ ...prev, [action]: { type, text } }));
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[action];
        return newMessages;
      });
    }, 5000);
  };

  const setActionLoading = (action: string, loading: boolean) => {
    setLoadingActions(prev => ({ ...prev, [action]: loading }));
  };

  // Criar nova API
  const handleCriarAPI = async () => {
    try {
      setActionLoading('criarAPI', true);
      
      const response = await api.post('/configuracoes/apis', novaAPI);
      
      toast.success('API configurada com sucesso!');
      setShowNovoAPI(false);
      setNovaAPI({
        plataforma: "",
        nome_conta: "",
        access_token: "",
        client_id: "",
        client_secret: ""
      });
      await carregarConfiguracoes();
      
    } catch (error) {
      console.error('Erro ao criar API:', error);
      toast.error('Erro ao configurar API');
    } finally {
      setActionLoading('criarAPI', false);
    }
  };

  // Testar API
  const handleTestarAPI = async (configId: number) => {
    try {
      setActionLoading(`testarAPI_${configId}`, true);
      
      const response = await api.post(`/configuracoes/apis/${configId}/testar`);
      
      if (response.data.sucesso) {
        toast.success('API testada com sucesso!');
        showMessage(`testarAPI_${configId}`, 'success', 'API funcionando corretamente');
      } else {
        toast.error('Falha no teste da API');
        showMessage(`testarAPI_${configId}`, 'error', response.data.erro || 'Erro desconhecido');
      }
      
    } catch (error) {
      console.error('Erro ao testar API:', error);
      toast.error('Erro ao testar API');
      showMessage(`testarAPI_${configId}`, 'error', 'Erro ao conectar com a API');
    } finally {
      setActionLoading(`testarAPI_${configId}`, false);
    }
  };

  // Deletar API
  const handleDeletarAPI = async (configId: number) => {
    if (!confirm('Tem certeza que deseja deletar esta configuração?')) return;
    
    try {
      setActionLoading(`deletarAPI_${configId}`, true);
      
      await api.delete(`/configuracoes/apis/${configId}`);
      
      toast.success('Configuração removida com sucesso!');
      await carregarConfiguracoes();
      
    } catch (error) {
      console.error('Erro ao deletar API:', error);
      toast.error('Erro ao remover configuração');
    } finally {
      setActionLoading(`deletarAPI_${configId}`, false);
    }
  };

  // Inicializar plataformas
  const handleInicializarPlataformas = async () => {
    try {
      setActionLoading('inicializarPlataformas', true);
      
      const response = await api.post('/configuracoes/plataformas/inicializar');
      
      toast.success('Plataformas inicializadas com sucesso!');
      await carregarConfiguracoes();
      
    } catch (error) {
      console.error('Erro ao inicializar plataformas:', error);
      toast.error('Erro ao inicializar plataformas');
    } finally {
      setActionLoading('inicializarPlataformas', false);
    }
  };

  // Sincronizar plataforma
  const handleSincronizarPlataforma = async (plataformaId: number) => {
    try {
      setActionLoading(`sincronizar_${plataformaId}`, true);
      
      const response = await api.post(`/configuracoes/plataformas/${plataformaId}/sincronizar`);
      
      toast.success('Sincronização concluída!');
      await carregarConfiguracoes();
      
    } catch (error) {
      console.error('Erro ao sincronizar plataforma:', error);
      toast.error('Erro na sincronização');
    } finally {
      setActionLoading(`sincronizar_${plataformaId}`, false);
    }
  };

  // Ativar/Desativar plataforma
  const handleTogglePlataforma = async (plataformaId: number, ativo: boolean) => {
    try {
      setActionLoading(`toggle_${plataformaId}`, true);
      
      await api.put(`/configuracoes/plataformas/${plataformaId}`, {
        ativo: !ativo
      });
      
      toast.success(`Plataforma ${ativo ? 'desativada' : 'ativada'} com sucesso!`);
      await carregarConfiguracoes();
      
    } catch (error) {
      console.error('Erro ao alterar status da plataforma:', error);
      toast.error('Erro ao alterar status');
    } finally {
      setActionLoading(`toggle_${plataformaId}`, false);
    }
  };

  // Criar configuração do sistema
  const handleCriarConfigSistema = async () => {
    try {
      setActionLoading('criarConfigSistema', true);
      
      const response = await api.post('/configuracoes/sistema', novaConfigSistema);
      
      toast.success('Configuração criada com sucesso!');
      setShowNovoSistema(false);
      setNovaConfigSistema({
        chave: "",
        valor: "",
        tipo: "string",
        descricao: "",
        categoria: ""
      });
      await carregarConfiguracoes();
      
    } catch (error) {
      console.error('Erro ao criar configuração:', error);
      toast.error('Erro ao criar configuração');
    } finally {
      setActionLoading('criarConfigSistema', false);
    }
  };

  // Atualizar configuração do sistema
  const handleAtualizarConfigSistema = async (configId: number, valor: string) => {
    try {
      setActionLoading(`atualizar_${configId}`, true);
      
      await api.put(`/configuracoes/sistema/${configId}`, {
        valor: valor
      });
      
      toast.success('Configuração atualizada com sucesso!');
      await carregarConfiguracoes();
      
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast.error('Erro ao atualizar configuração');
    } finally {
      setActionLoading(`atualizar_${configId}`, false);
    }
  };

  // Deletar configuração do sistema
  const handleDeletarConfigSistema = async (configId: number) => {
    if (!confirm('Tem certeza que deseja deletar esta configuração?')) return;
    
    try {
      setActionLoading(`deletarConfig_${configId}`, true);
      
      await api.delete(`/configuracoes/sistema/${configId}`);
      
      toast.success('Configuração removida com sucesso!');
      await carregarConfiguracoes();
      
    } catch (error) {
      console.error('Erro ao deletar configuração:', error);
      toast.error('Erro ao remover configuração');
    } finally {
      setActionLoading(`deletarConfig_${configId}`, false);
    }
  };

  // Testar conexão com banco
  const handleTestarConexao = async () => {
    try {
      setActionLoading('testarConexao', true);
      
      const response = await api.get('/configuracoes/testar-conexao');
      
      if (response.data.sucesso) {
        toast.success('Conexão com banco de dados OK!');
      } else {
        toast.error('Falha na conexão com banco');
      }
      
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      toast.error('Erro ao testar conexão');
    } finally {
      setActionLoading('testarConexao', false);
    }
  };

  // Limpar cache do sistema
  const handleLimparCache = async () => {
    try {
      setActionLoading('limparCache', true);
      
      await api.post('/configuracoes/limpar-cache');
      
      toast.success('Cache limpo com sucesso!');
      
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      toast.error('Erro ao limpar cache');
    } finally {
      setActionLoading('limparCache', false);
    }
  };

  // Reiniciar serviços
  const handleReiniciarServicos = async () => {
    if (!confirm('Tem certeza que deseja reiniciar os serviços? Isso pode causar interrupção temporária.')) return;
    
    try {
      setActionLoading('reiniciarServicos', true);
      
      await api.post('/configuracoes/reiniciar-servicos');
      
      toast.success('Serviços reiniciados com sucesso!');
      
    } catch (error) {
      console.error('Erro ao reiniciar serviços:', error);
      toast.error('Erro ao reiniciar serviços');
    } finally {
      setActionLoading('reiniciarServicos', false);
    }
  };

  const getPlataformaIcon = (plataforma: string) => {
    const icons: { [key: string]: any } = {
      'mercado_livre': Globe,
      'shopify': ExternalLink,
      'woocommerce': Database,
      'nuvemshop': Globe,
      'vtex': ExternalLink
    };
    return icons[plataforma] || Settings;
  };

  const getStatusColor = (ativo: boolean) => {
    return ativo ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (ativo: boolean) => {
    return ativo ? CheckCircle : AlertTriangle;
  };

  useEffect(() => {
    setMounted(true);
    if (mounted) {
      carregarConfiguracoes();
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <ProtectedRoute>
        <LayoutGestor>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800">Carregando Configurações...</h2>
            </div>
          </div>
        </LayoutGestor>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <LayoutGestor>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800">Verificando Permissões...</h2>
            </div>
          </div>
        </LayoutGestor>
      </ProtectedRoute>
    );
  }

  if (!user || user.perfil !== 'GESTOR') {
    return (
      <ProtectedRoute>
        <LayoutGestor>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">🔒 Acesso Restrito</h1>
                <p className="text-gray-600">
                  Esta área é exclusiva para gestores. Faça login com suas credenciais de gestor.
                </p>
              </div>
            </div>
          </div>
        </LayoutGestor>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Settings className="w-8 h-8" />
                  Configurações do Sistema
                </h1>
                <p className="text-blue-100 text-lg">
                  Gerencie APIs, plataformas e configurações do sistema
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleTestarConexao}
                  disabled={loadingActions.testarConexao}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                >
                  <Database className="w-5 h-5" />
                  {loadingActions.testarConexao ? 'Testando...' : 'Testar Conexão'}
                </button>

                <button
                  onClick={handleLimparCache}
                  disabled={loadingActions.limparCache}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className="w-5 h-5" />
                  {loadingActions.limparCache ? 'Limpando...' : 'Limpar Cache'}
                </button>
              </div>
            </div>
          </div>

          {/* Sistema de Abas */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-white rounded-2xl p-1 shadow-lg">
              {[
                { id: "apis", label: "APIs", icon: Key },
                { id: "plataformas", label: "Plataformas", icon: Globe },
                { id: "sistema", label: "Sistema", icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 font-medium ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conteúdo das Abas */}
          {activeTab === "apis" && (
            <div className="space-y-8">
              {/* Configurações de API */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Key className="w-6 h-6 text-blue-600" />
                      Configurações de API
                    </h2>
                    <p className="text-gray-600">Gerencie as integrações com APIs externas</p>
                  </div>

                  <button
                    onClick={() => setShowNovoAPI(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Nova API
                  </button>
                </div>

                {/* Lista de APIs */}
                <div className="space-y-4">
                  {configuracoesAPI.map((api) => (
                    <div key={api.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Key className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{api.plataforma}</h3>
                            <p className="text-sm text-gray-600">{api.nome_conta}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${api.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {api.ativo ? 'Ativo' : 'Inativo'}
                              </span>
                              {api.ultima_sincronizacao && (
                                <span className="text-xs text-gray-500">
                                  Última sinc: {new Date(api.ultima_sincronizacao).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTestarAPI(api.id)}
                            disabled={loadingActions[`testarAPI_${api.id}`]}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <TestTube className="w-4 h-4" />
                            {loadingActions[`testarAPI_${api.id}`] ? 'Testando...' : 'Testar'}
                          </button>

                          <button
                            onClick={() => handleDeletarAPI(api.id)}
                            disabled={loadingActions[`deletarAPI_${api.id}`]}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            {loadingActions[`deletarAPI_${api.id}`] ? 'Removendo...' : 'Remover'}
                          </button>
                        </div>
                      </div>

                      {messages[`testarAPI_${api.id}`] && (
                        <div className={`mt-2 p-2 rounded-lg text-sm ${messages[`testarAPI_${api.id}`].type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {messages[`testarAPI_${api.id}`].text}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "plataformas" && (
            <div className="space-y-8">
              {/* Configurações de Plataformas */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Globe className="w-6 h-6 text-purple-600" />
                      Plataformas de Venda
                    </h2>
                    <p className="text-gray-600">Gerencie as integrações com marketplaces e e-commerces</p>
                  </div>

                  <button
                    onClick={handleInicializarPlataformas}
                    disabled={loadingActions.inicializarPlataformas}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    {loadingActions.inicializarPlataformas ? 'Inicializando...' : 'Inicializar Plataformas'}
                  </button>
                </div>

                {/* Lista de Plataformas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {configuracoesPlataforma.map((plataforma) => {
                    const Icon = getPlataformaIcon(plataforma.plataforma);
                    const StatusIcon = getStatusIcon(plataforma.ativo);
                    
                    return (
                      <div key={plataforma.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-lg">
                              <Icon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{plataforma.nome_exibicao}</h3>
                              <p className="text-sm text-gray-600">{plataforma.descricao}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <StatusIcon className={`w-4 h-4 ${getStatusColor(plataforma.ativo)}`} />
                                <span className={`text-xs px-2 py-1 rounded-full ${plataforma.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {plataforma.ativo ? 'Ativo' : 'Inativo'}
                                </span>
                                {plataforma.em_desenvolvimento && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                    Em Desenvolvimento
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSincronizarPlataforma(plataforma.id)}
                              disabled={loadingActions[`sincronizar_${plataforma.id}`]}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              {loadingActions[`sincronizar_${plataforma.id}`] ? 'Sincronizando...' : 'Sincronizar'}
                            </button>

                            <button
                              onClick={() => handleTogglePlataforma(plataforma.id, plataforma.ativo)}
                              disabled={loadingActions[`toggle_${plataforma.id}`]}
                              className={`px-3 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
                                plataforma.ativo 
                                  ? 'bg-red-600 text-white hover:bg-red-700' 
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {loadingActions[`toggle_${plataforma.id}`] ? 'Alterando...' : (plataforma.ativo ? 'Desativar' : 'Ativar')}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "sistema" && (
            <div className="space-y-8">
              {/* Configurações do Sistema */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Settings className="w-6 h-6 text-green-600" />
                      Configurações do Sistema
                    </h2>
                    <p className="text-gray-600">Gerencie as configurações internas do sistema</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleReiniciarServicos}
                      disabled={loadingActions.reiniciarServicos}
                      className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Activity className="w-5 h-5" />
                      {loadingActions.reiniciarServicos ? 'Reiniciando...' : 'Reiniciar Serviços'}
                    </button>

                    <button
                      onClick={() => setShowNovoSistema(true)}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Nova Configuração
                    </button>
                  </div>
                </div>

                {/* Lista de Configurações */}
                <div className="space-y-4">
                  {configuracoesSistema.map((config) => (
                    <div key={config.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Settings className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{config.chave}</h3>
                              <p className="text-sm text-gray-600">{config.descricao}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                  {config.tipo}
                                </span>
                                {config.categoria && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                    {config.categoria}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            defaultValue={config.valor || ''}
                            onBlur={(e) => handleAtualizarConfigSistema(config.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Valor"
                          />

                          <button
                            onClick={() => handleDeletarConfigSistema(config.id)}
                            disabled={loadingActions[`deletarConfig_${config.id}`]}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            {loadingActions[`deletarConfig_${config.id}`] ? 'Removendo...' : 'Remover'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal Nova API */}
          {showNovoAPI && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Nova Configuração de API</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                    <input
                      type="text"
                      value={novaAPI.plataforma}
                      onChange={(e) => setNovaAPI(prev => ({ ...prev, plataforma: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Mercado Livre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Conta</label>
                    <input
                      type="text"
                      value={novaAPI.nome_conta}
                      onChange={(e) => setNovaAPI(prev => ({ ...prev, nome_conta: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Conta Principal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                    <input
                      type="password"
                      value={novaAPI.access_token}
                      onChange={(e) => setNovaAPI(prev => ({ ...prev, access_token: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Token de acesso"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                    <input
                      type="text"
                      value={novaAPI.client_id}
                      onChange={(e) => setNovaAPI(prev => ({ ...prev, client_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ID do cliente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
                    <input
                      type="password"
                      value={novaAPI.client_secret}
                      onChange={(e) => setNovaAPI(prev => ({ ...prev, client_secret: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Secret do cliente"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={handleCriarAPI}
                    disabled={loadingActions.criarAPI}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loadingActions.criarAPI ? 'Criando...' : 'Criar API'}
                  </button>
                  <button
                    onClick={() => setShowNovoAPI(false)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Nova Configuração do Sistema */}
          {showNovoSistema && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Nova Configuração do Sistema</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chave</label>
                    <input
                      type="text"
                      value={novaConfigSistema.chave}
                      onChange={(e) => setNovaConfigSistema(prev => ({ ...prev, chave: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: MAX_UPLOAD_SIZE"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                    <input
                      type="text"
                      value={novaConfigSistema.valor}
                      onChange={(e) => setNovaConfigSistema(prev => ({ ...prev, valor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: 10485760"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={novaConfigSistema.tipo}
                      onChange={(e) => setNovaConfigSistema(prev => ({ ...prev, tipo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={novaConfigSistema.descricao}
                      onChange={(e) => setNovaConfigSistema(prev => ({ ...prev, descricao: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Descrição da configuração"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input
                      type="text"
                      value={novaConfigSistema.categoria}
                      onChange={(e) => setNovaConfigSistema(prev => ({ ...prev, categoria: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Sistema"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={handleCriarConfigSistema}
                    disabled={loadingActions.criarConfigSistema}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loadingActions.criarConfigSistema ? 'Criando...' : 'Criar Configuração'}
                  </button>
                  <button
                    onClick={() => setShowNovoSistema(false)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 