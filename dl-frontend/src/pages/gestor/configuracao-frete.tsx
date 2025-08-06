import {
    AlertCircle,
    CheckCircle,
    Save,
    Settings,
    TestTube,
    Truck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import LayoutGestor from '../../components/layout/LayoutGestor';
import { api } from '@/config/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

interface ConfiguracaoFrete {
    frenet_api_key: string;
    frenet_cep_origem: string;
    whatsapp_ativo: boolean;
}

export default function ConfiguracaoFrete() {
    const [config, setConfig] = useState<ConfiguracaoFrete>({
        frenet_api_key: '',
        frenet_cep_origem: '',
        whatsapp_ativo: false
    });
    const [loading, setLoading] = useState(false);
    const [testando, setTestando] = useState(false);
    const [resultadoTeste, setResultadoTeste] = useState<string>('');
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarConfiguracao();
    }, []);

    const carregarConfiguracao = async () => {
        try {
            const data = await api.get('/configuracao/frete');
            if (data && typeof data === 'object' && 'config' in data) {
                setConfig((data as any).config);
            }
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
        }
    };

    const salvarConfiguracao = async () => {
        setSalvando(true);
        try {
            const data = await api.post('/configuracao/frete', config);
            if (data && typeof data === 'object' && 'sucesso' in data && data.sucesso === true) {
                setResultadoTeste('✅ Configuração salva com sucesso!');
            } else {
                setResultadoTeste('❌ Erro ao salvar configuração');
            }
        } catch (error) {
            setResultadoTeste('❌ Erro ao salvar configuração');
        } finally {
            setSalvando(false);
        }
    };

    const testarConfiguracao = async () => {
        setTestando(true);
        setResultadoTeste('');

        try {
            const data = await api.post('/frete/testar-configuracao', config);
            if (data && typeof data === 'object' && 'sucesso' in data && data.sucesso === true) {
                setResultadoTeste('✅ Configuração testada com sucesso! API Frenet funcionando.');
            } else if (data && typeof data === 'object' && 'erro' in data) {
                setResultadoTeste(`❌ Erro no teste: ${(data as any).erro}`);
            } else {
                setResultadoTeste('❌ Erro desconhecido ao testar configuração');
            }
        } catch (error) {
            setResultadoTeste('❌ Erro ao testar configuração');
        } finally {
            setTestando(false);
        }
    };

    return (
        <LayoutGestor>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Configuração de Frete</h1>
                        <p className="text-gray-600">Configure as integrações de frete da DL Auto Peças</p>
                    </div>
                </div>

                {/* Configuração Frenet */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            Configuração Frenet API
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Token da API Frenet
                            </label>
                            <Input
                                type="password"
                                value={config.frenet_api_key}
                                onChange={(e) => setConfig({ ...config, frenet_api_key: e.target.value })}
                                placeholder="Digite o token da API Frenet"
                                className="font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Token fornecido pela Frenet para cálculo de fretes
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CEP de Origem
                            </label>
                            <Input
                                type="text"
                                value={config.frenet_cep_origem}
                                onChange={(e) => setConfig({ ...config, frenet_cep_origem: e.target.value })}
                                placeholder="01310100"
                                maxLength={8}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                CEP da sede da DL Auto Peças (São Paulo - SP)
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="whatsapp_ativo"
                                checked={config.whatsapp_ativo}
                                onChange={(e) => setConfig({ ...config, whatsapp_ativo: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="whatsapp_ativo" className="text-sm font-medium text-gray-700">
                                Ativar integração com WhatsApp
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">
                            Quando ativado, a IA responderá automaticamente sobre fretes via WhatsApp
                        </p>
                    </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex gap-4">
                    <Button
                        onClick={testarConfiguracao}
                        disabled={testando || !config.frenet_api_key}
                        variant="outline"
                    >
                        <TestTube className="w-4 h-4 mr-2" />
                        {testando ? 'Testando...' : 'Testar Configuração'}
                    </Button>

                    <Button
                        onClick={salvarConfiguracao}
                        disabled={salvando}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {salvando ? 'Salvando...' : 'Salvar Configuração'}
                    </Button>
                </div>

                {/* Resultado */}
                {resultadoTeste && (
                    <Card>
                        <CardContent className="p-4">
                            <div className={`flex items-center gap-2 ${resultadoTeste.includes('✅') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {resultadoTeste.includes('✅') ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5" />
                                )}
                                <span>{resultadoTeste}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Informações */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Informações Importantes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Token Frenet</h4>
                            <p className="text-sm text-blue-700">
                                O token da API Frenet é obrigatório para calcular fretes reais.
                                Sem ele, o sistema usará cálculos simulados.
                            </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">CEP de Origem</h4>
                            <p className="text-sm text-green-700">
                                Este CEP será usado como ponto de partida para todos os cálculos de frete.
                                Deve ser o CEP da sede da DL Auto Peças.
                            </p>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-900 mb-2">WhatsApp</h4>
                            <p className="text-sm text-yellow-700">
                                A integração com WhatsApp só deve ser ativada quando o sistema estiver
                                em produção com o número oficial configurado.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </LayoutGestor>
    );
} 