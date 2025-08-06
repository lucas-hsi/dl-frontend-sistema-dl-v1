"use client";

import { RastreamentoIA } from '@/components/anuncios/RastreamentoIA';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { anuncioService } from '@/services/anuncioService';
import {
    AlertTriangle,
    Brain,
    CheckCircle,
    Sparkles,
    Upload
} from 'lucide-react';
import React, { useState } from 'react';

interface AnuncioGerado {
    titulo: string;
    descricao: string;
    preco_sugerido: number;
    sku: string;
    rastreio_origem: {
        fonte_ia: string;
        modelo_detectado: string;
        compatibilidade: string;
        argumento_destaque: string;
        garantia: string;
        preco_base: string;
        qualidade_imagem: string;
        concorrentes_analisados: number;
        dados_tecnicos: string;
    };
}

export default function CriarAnuncioPage() {
    const [loading, setLoading] = useState(false);
    const [anuncioGerado, setAnuncioGerado] = useState<AnuncioGerado | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        categoria: '',
        descricao: '',
        preco: '',
        imagem: '',
        carros_compativeis: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGerarAnuncio = async () => {
        setLoading(true);
        setError(null);
        setAnuncioGerado(null);
        try {
            // Chamada real para a API de IA
            const response = await anuncioService.gerarConteudoIA({
                categoria: formData.categoria,
                nome_produto: formData.nome,
            });
            setAnuncioGerado({
                titulo: response.nome_produto,
                descricao: response.descricao,
                preco_sugerido: response.preco_sugerido,
                sku: (response as any).sku_gerado || '',
                rastreio_origem: response.rastreio_origem || {} as any,
            });
        } catch (error: any) {
            setError(
                error?.message ||
                'Erro ao gerar anúncio com IA. Tente novamente ou contate o suporte.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReportarErro = () => {
        // Implementar lógica para reportar erro
        alert('Erro reportado! Nossa equipe irá analisar.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Criar Anúncio com IA
                    </h1>
                    <p className="text-gray-600">
                        Preencha os dados da peça e deixe a IA gerar um anúncio otimizado
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Formulário */}
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                Dados da Peça
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome da Peça
                                </label>
                                <Input
                                    id="nome"
                                    value={formData.nome}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('nome', e.target.value)}
                                    placeholder="Ex: Compressor Ar Peugeot 207"
                                />
                            </div>

                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                                    SKU
                                </label>
                                <Input
                                    id="sku"
                                    value={anuncioGerado?.sku || ''}
                                    disabled
                                    className="mt-1 w-full bg-gray-100 border rounded px-3 py-2 text-sm text-gray-700"
                                    placeholder="SKU gerada automaticamente"
                                />
                            </div>

                            <div>
                                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoria
                                </label>
                                <Input
                                    id="categoria"
                                    value={formData.categoria}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('categoria', e.target.value)}
                                    placeholder="Ex: Elétrica, Freios, Suspensão"
                                />
                            </div>

                            <div>
                                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                                    Descrição Técnica
                                </label>
                                <textarea
                                    id="descricao"
                                    value={formData.descricao}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('descricao', e.target.value)}
                                    placeholder="Descreva as especificações técnicas da peça..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                                    Preço Sugerido
                                </label>
                                <Input
                                    id="preco"
                                    type="number"
                                    value={formData.preco}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('preco', e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label htmlFor="carros_compativeis" className="block text-sm font-medium text-gray-700 mb-1">
                                    Carros Compatíveis
                                </label>
                                <Input
                                    id="carros_compativeis"
                                    value={formData.carros_compativeis}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('carros_compativeis', e.target.value)}
                                    placeholder="Ex: Peugeot 207, Citroën C3"
                                />
                            </div>

                            <div>
                                <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-1">
                                    URL da Imagem
                                </label>
                                <Input
                                    id="imagem"
                                    value={formData.imagem}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('imagem', e.target.value)}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                />
                            </div>

                            <Button
                                onClick={handleGerarAnuncio}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {loading ? (
                                    <>
                                        <Brain className="w-4 h-4 mr-2 animate-spin" />
                                        Gerando anúncio...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Gerar Anúncio com IA
                                    </>
                                )}
                            </Button>
                            {error && (
                                <div className="bg-red-100 text-red-700 border border-red-300 rounded p-2 flex items-center gap-2 mt-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Resultado */}
                    <div className="space-y-4">
                        {anuncioGerado && (
                            <>
                                {/* Rastreamento IA */}
                                <RastreamentoIA
                                    rastreio={{
                                        fonte_ia: anuncioGerado.rastreio_origem?.fonte_ia || '',
                                        modelo_detectado: anuncioGerado.rastreio_origem?.modelo_detectado || '',
                                        compatibilidade: anuncioGerado.rastreio_origem?.compatibilidade || '',
                                        argumento_destaque: anuncioGerado.rastreio_origem?.argumento_destaque || '',
                                        garantia: anuncioGerado.rastreio_origem?.garantia || '',
                                        preco_base: anuncioGerado.rastreio_origem?.preco_base || '',
                                        qualidade_imagem: anuncioGerado.rastreio_origem?.qualidade_imagem || '',
                                        concorrentes_analisados: anuncioGerado.rastreio_origem?.concorrentes_analisados || 0,
                                        dados_tecnicos: anuncioGerado.rastreio_origem?.dados_tecnicos || '',
                                    }}
                                    onReportarErro={handleReportarErro}
                                />

                                {/* Anúncio Gerado */}
                                <Card className="shadow-xl border-green-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-green-700">
                                            <CheckCircle className="w-5 h-5" />
                                            Anúncio Gerado
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Título
                                            </label>
                                            <p className="text-lg font-semibold mt-1">
                                                {anuncioGerado.titulo}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Preço Sugerido
                                            </label>
                                            <p className="text-2xl font-bold text-green-600 mt-1">
                                                R$ {Number(anuncioGerado.preco_sugerido).toFixed(2)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                SKU
                                            </label>
                                            <p className="text-lg font-semibold mt-1">
                                                {anuncioGerado.sku || ''}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Descrição
                                            </label>
                                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                                <pre className="whitespace-pre-wrap text-sm">
                                                    {anuncioGerado.descricao}
                                                </pre>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button className="flex-1 bg-green-600 hover:bg-green-700" data-qa="anuncios-Publicar">
                                                <Upload className="w-4 h-4 mr-2" />
                                                Publicar Anúncio
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                                Editar Manualmente
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Estado vazio */}
                        {!anuncioGerado && !loading && !error && (
                            <Card className="shadow-xl border-dashed border-gray-300">
                                <CardContent className="text-center py-12">
                                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                                        Anúncio será gerado aqui
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Preencha os dados da peça e clique em "Gerar Anúncio"
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 