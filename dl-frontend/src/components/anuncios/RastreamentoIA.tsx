"use client";

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertTriangle,
    Brain,
    Car,
    DollarSign,
    Image,
    Info,
    Search,
    Settings,
    Shield,
    Users,
    X
} from 'lucide-react';
import React, { useState } from 'react';

interface RastreamentoOrigem {
    fonte_ia: string;
    modelo_detectado: string;
    compatibilidade: string;
    argumento_destaque: string;
    garantia: string;
    preco_base: string;
    qualidade_imagem: string;
    concorrentes_analisados: number;
    dados_tecnicos: string;
}

interface RastreamentoIAProps {
    rastreio?: RastreamentoOrigem;
    onReportarErro?: () => void;
    className?: string;
}

export const RastreamentoIA: React.FC<RastreamentoIAProps> = ({
    rastreio,
    onReportarErro,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!rastreio) {
        return null;
    }

    const abrirSidebar = () => setIsOpen(true);
    const fecharSidebar = () => setIsOpen(false);

    const getFonteIcon = (fonte: string) => {
        return fonte === 'GPT-4' ? <Brain className="w-4 h-4" /> : <Settings className="w-4 h-4" />;
    };

    const getFonteColor = (fonte: string) => {
        return fonte === 'GPT-4' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
    };

    return (
        <>
            {/* Alert principal */}
            <Alert
                variant="default"
                className={`cursor-pointer hover:bg-blue-50 transition-colors ${className}`}
                onClick={abrirSidebar}
            >
                <Info className="h-4 w-4" />
                <AlertDescription className="flex items-center gap-2">
                    🔍 A IA gerou este anúncio — clique aqui para ver de onde vieram os dados
                    <Badge variant="outline" className={getFonteColor(rastreio.fonte_ia)}>
                        {getFonteIcon(rastreio.fonte_ia)}
                        {rastreio.fonte_ia}
                    </Badge>
                </AlertDescription>
            </Alert>

            {/* Drawer/Sidebar */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-semibold">Fontes da Análise de IA</h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={fecharSidebar}
                                className="h-8 w-8 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            {/* Fonte da IA */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        {getFonteIcon(rastreio.fonte_ia)}
                                        Fonte da IA
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Badge className={getFonteColor(rastreio.fonte_ia)}>
                                        {rastreio.fonte_ia}
                                    </Badge>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {rastreio.fonte_ia === 'GPT-4'
                                            ? 'Análise avançada com IA externa'
                                            : 'Processamento local otimizado'
                                        }
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Modelo Detectado */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Search className="w-4 h-4" />
                                        Modelo Detectado
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{rastreio.modelo_detectado}</p>
                                </CardContent>
                            </Card>

                            {/* Compatibilidade */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Car className="w-4 h-4" />
                                        Compatibilidade
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{rastreio.compatibilidade}</p>
                                </CardContent>
                            </Card>

                            {/* Argumento de Destaque */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Destaque do Anúncio
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{rastreio.argumento_destaque}</p>
                                </CardContent>
                            </Card>

                            {/* Garantia */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Garantia
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{rastreio.garantia}</p>
                                </CardContent>
                            </Card>

                            {/* Preço Base */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Base do Preço
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{rastreio.preco_base}</p>
                                </CardContent>
                            </Card>

                            {/* Qualidade da Imagem */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Image className="w-4 h-4" />
                                        Qualidade da Imagem
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{rastreio.qualidade_imagem}</p>
                                </CardContent>
                            </Card>

                            {/* Concorrentes Analisados */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Concorrentes Analisados
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">
                                            {rastreio.concorrentes_analisados} concorrentes
                                        </Badge>
                                        <p className="text-xs text-gray-600">
                                            {rastreio.concorrentes_analisados > 0
                                                ? 'Análise competitiva realizada'
                                                : 'Análise baseada em padrões do mercado'
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Dados Técnicos */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        Dados Técnicos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{rastreio.dados_tecnicos}</p>
                                </CardContent>
                            </Card>

                            {/* Botão Reportar Erro */}
                            {onReportarErro && (
                                <Card className="border-orange-200 bg-orange-50">
                                    <CardContent className="pt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={onReportarErro}
                                            className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                                        >
                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                            Reportar Erro de Análise
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RastreamentoIA; 