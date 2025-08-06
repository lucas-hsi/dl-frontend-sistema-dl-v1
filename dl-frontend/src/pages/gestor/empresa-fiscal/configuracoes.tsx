"use client";

import LayoutGestor from '@/components/layout/LayoutGestor';
import {
    AlertCircle,
    Building2,
    FileText,
    Save,
    Settings,
    Shield
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { api } from '@/config/api';

interface ConfigFiscal {
    id?: number;
    cnpj: string;
    razao_social: string;
    nome_fantasia?: string;
    inscricao_estadual?: string;
    inscricao_municipal?: string;
    cep: string;
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    telefone?: string;
    email?: string;
    certificado_path?: string;
    certificado_senha?: string;
    serie_nfe: string;
    ambiente: 'homologacao' | 'producao';
    cfop_padrao: string;
    natureza_operacao: string;
    aliquota_icms: number;
    aliquota_pis: number;
    aliquota_cofins: number;
}

const ConfiguracoesFiscais: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<ConfigFiscal>({
        cnpj: '',
        razao_social: '',
        nome_fantasia: '',
        inscricao_estadual: '',
        inscricao_municipal: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        telefone: '',
        email: '',
        certificado_path: '',
        certificado_senha: '',
        serie_nfe: '1',
        ambiente: 'homologacao',
        cfop_padrao: '5102',
        natureza_operacao: 'Venda de mercadoria',
        aliquota_icms: 17.0,
        aliquota_pis: 1.65,
        aliquota_cofins: 7.6
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const carregarConfig = async () => {
        try {
            setLoading(true);
            const data = await api.get('/gestor/fiscal/config');
            if (data && typeof data === 'object' && 'config' in data) {
                setConfig((data as any).config);
            }
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarConfig();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const data = await api.post('/gestor/fiscal/config', config);

            if (data && typeof data === 'object' && 'success' in data && data.success === true) {
                setSuccess('Configuração fiscal salva com sucesso!');
            } else if (data && typeof data === 'object' && 'message' in data) {
                setError((data as any).message || 'Erro ao salvar configuração');
            } else {
                setError('Erro ao salvar configuração');
            }
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            setError('Erro ao salvar configuração. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: keyof ConfigFiscal, value: string | number) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <LayoutGestor>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando configurações fiscais...</p>
                    </div>
                </div>
            </LayoutGestor>
        );
    }

    return (
        <LayoutGestor>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Configurações Fiscais</h1>
                                <p className="text-blue-100">Configure os dados fiscais da empresa</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                <span>{saving ? 'Salvando...' : 'Salvar'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Alertas */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <strong>Erro:</strong> {error}
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6">
                        <div className="flex items-center">
                            <Shield className="h-5 w-5 mr-2" />
                            <strong>Sucesso:</strong> {success}
                        </div>
                    </div>
                )}

                {/* Formulário */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Dados da Empresa */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                                Dados da Empresa
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CNPJ *
                                    </label>
                                    <input
                                        type="text"
                                        value={config.cnpj}
                                        onChange={(e) => handleInputChange('cnpj', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="00.000.000/0000-00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Razão Social *
                                    </label>
                                    <input
                                        type="text"
                                        value={config.razao_social}
                                        onChange={(e) => handleInputChange('razao_social', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nome da empresa"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome Fantasia
                                    </label>
                                    <input
                                        type="text"
                                        value={config.nome_fantasia}
                                        onChange={(e) => handleInputChange('nome_fantasia', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nome fantasia"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Inscrição Estadual
                                    </label>
                                    <input
                                        type="text"
                                        value={config.inscricao_estadual}
                                        onChange={(e) => handleInputChange('inscricao_estadual', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="IE"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Endereço */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Settings className="h-5 w-5 mr-2 text-green-600" />
                                Endereço
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CEP *
                                    </label>
                                    <input
                                        type="text"
                                        value={config.cep}
                                        onChange={(e) => handleInputChange('cep', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="00000-000"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Endereço *
                                    </label>
                                    <input
                                        type="text"
                                        value={config.endereco}
                                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Rua/Avenida"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número *
                                    </label>
                                    <input
                                        type="text"
                                        value={config.numero}
                                        onChange={(e) => handleInputChange('numero', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="123"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Complemento
                                    </label>
                                    <input
                                        type="text"
                                        value={config.complemento}
                                        onChange={(e) => handleInputChange('complemento', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Apto 101"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bairro *
                                    </label>
                                    <input
                                        type="text"
                                        value={config.bairro}
                                        onChange={(e) => handleInputChange('bairro', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Centro"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cidade *
                                    </label>
                                    <input
                                        type="text"
                                        value={config.cidade}
                                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="São Paulo"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        UF *
                                    </label>
                                    <select
                                        value={config.uf}
                                        onChange={(e) => handleInputChange('uf', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Selecione</option>
                                        <option value="SP">SP</option>
                                        <option value="RJ">RJ</option>
                                        <option value="MG">MG</option>
                                        <option value="RS">RS</option>
                                        <option value="PR">PR</option>
                                        <option value="SC">SC</option>
                                        <option value="BA">BA</option>
                                        <option value="GO">GO</option>
                                        <option value="MT">MT</option>
                                        <option value="MS">MS</option>
                                        <option value="DF">DF</option>
                                        <option value="CE">CE</option>
                                        <option value="PE">PE</option>
                                        <option value="PA">PA</option>
                                        <option value="AM">AM</option>
                                        <option value="RO">RO</option>
                                        <option value="AC">AC</option>
                                        <option value="RR">RR</option>
                                        <option value="AP">AP</option>
                                        <option value="TO">TO</option>
                                        <option value="PI">PI</option>
                                        <option value="MA">MA</option>
                                        <option value="RN">RN</option>
                                        <option value="PB">PB</option>
                                        <option value="AL">AL</option>
                                        <option value="SE">SE</option>
                                        <option value="ES">ES</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Configurações NF-e */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                                Configurações NF-e
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Série NF-e
                                    </label>
                                    <input
                                        type="text"
                                        value={config.serie_nfe}
                                        onChange={(e) => handleInputChange('serie_nfe', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ambiente
                                    </label>
                                    <select
                                        value={config.ambiente}
                                        onChange={(e) => handleInputChange('ambiente', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="homologacao">Homologação</option>
                                        <option value="producao">Produção</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CFOP Padrão
                                    </label>
                                    <input
                                        type="text"
                                        value={config.cfop_padrao}
                                        onChange={(e) => handleInputChange('cfop_padrao', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="5102"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Natureza da Operação
                                    </label>
                                    <input
                                        type="text"
                                        value={config.natureza_operacao}
                                        onChange={(e) => handleInputChange('natureza_operacao', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Venda de mercadoria"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Alíquotas */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Shield className="h-5 w-5 mr-2 text-orange-600" />
                                Alíquotas (%)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ICMS
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={config.aliquota_icms}
                                        onChange={(e) => handleInputChange('aliquota_icms', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="17.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        PIS
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={config.aliquota_pis}
                                        onChange={(e) => handleInputChange('aliquota_pis', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="1.65"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        COFINS
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={config.aliquota_cofins}
                                        onChange={(e) => handleInputChange('aliquota_cofins', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="7.6"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botão Salvar */}
                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center space-x-2"
                            >
                                <Save className="h-5 w-5" />
                                <span>{saving ? 'Salvando...' : 'Salvar Configuração'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </LayoutGestor>
    );
};

export default ConfiguracoesFiscais;