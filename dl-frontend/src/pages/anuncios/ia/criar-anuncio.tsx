import PreviewAnuncio from "@/components/anuncios/PreviewAnuncio";
import { RastreamentoConcorrencia } from "@/components/anuncios/RastreamentoConcorrencia";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutAnuncios from "@/components/layout/LayoutAnuncios";
import { useAuth } from "@/contexts/AuthContext";
import { AnuncioFormData, anuncioService } from "@/services/anuncioService";
import { iaService } from "@/services/iaService"; // Adicionado para o escalonamento
import {
  AlertTriangle,
  Bot,
  Camera,
  CheckCircle,
  Download,
  Eye,
  Loader2,
  Save,
  Sparkles,
  Upload,
  Wand2,
  X,
  Zap
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string;
  name: string;
  status: 'processing' | 'completed' | 'error';
}

export default function CriarAnuncio() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState<AnuncioFormData>({
    nome_produto: "",
    categoria: "",
    marca: "",
    modelo_veiculo: "",
    ano_veiculo: "",
    descricao: "",
    preco: 0,
    estoque: 1,
    tags: [],
    imagens: [],
    canais_publicacao: {
      mercado_livre: false,
      shopify: true,
      site_proprio: true
    }
  });

  // Estados específicos do módulo IA
  const [uploadedImages, setUploadedImages] = useState<ProcessedImage[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isCreatingZIP, setIsCreatingZIP] = useState(false);
  const [isPublishingShopify, setIsPublishingShopify] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Estados para criação de anúncio com IA
  const [dadosPeca, setDadosPeca] = useState({
    peca: '',
    veiculo: '',
    ano: '',
    lado: '',
    condicao: 'Usado Original com Avaria Leve'
  });
  const [resultadoAnuncio, setResultadoAnuncio] = useState<any>(null);
  const [isGerandoAnuncio, setIsGerandoAnuncio] = useState(false);
  const [historicoGeracoes, setHistoricoGeracoes] = useState<any[]>([]);
  const [mostrarRastreio, setMostrarRastreio] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Proteção de acesso
  if (loading || !mounted || !user || user.perfil !== "ANUNCIANTE") {
    return null;
  }

  // Componente de feedback visual
  const FeedbackMessage = ({ type, message }: { type: 'success' | 'error', message: string }) => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border shadow-lg ${type === 'success'
      ? 'bg-green-50 border-green-200 text-green-700'
      : 'bg-red-50 border-red-200 text-red-700'
      }`}>
      <div className="flex items-center gap-2">
        {type === 'success' && <CheckCircle className="w-5 h-5" />}
        {type === 'error' && <AlertTriangle className="w-5 h-5" />}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );

  // Função para processar upload de imagens
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validações
    if (files.length < 2) {
      setErro("Mínimo 2 imagens são necessárias");
      setTimeout(() => setErro(null), 3000);
      return;
    }

    if (files.length > 6) {
      setErro("Máximo 6 imagens permitidas");
      setTimeout(() => setErro(null), 3000);
      return;
    }

    // Validar tipos e tamanhos
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const tamanhoMaximo = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!tiposPermitidos.includes(file.type)) {
        setErro(`Arquivo inválido: ${file.name}. Use apenas JPG, PNG ou WebP.`);
        setTimeout(() => setErro(null), 5000);
        return;
      }

      if (file.size > tamanhoMaximo) {
        setErro(`Arquivo muito grande: ${file.name}. Máximo 5MB por arquivo.`);
        setTimeout(() => setErro(null), 5000);
        return;
      }
    }

    setIsProcessingImages(true);
    setErro(null);
    setSucesso(null);

    try {
      const newImages: ProcessedImage[] = [];

      // Criar previews imediatos
      for (const file of files) {
        const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const originalUrl = URL.createObjectURL(file);

        newImages.push({
          id: imageId,
          originalUrl,
          processedUrl: originalUrl, // Temporário
          name: file.name,
          status: 'processing'
        });
      }

      setUploadedImages(prev => [...prev, ...newImages]);

      // Processar cada imagem com IA (tratamento completo unificado)
      for (let i = 0; i < newImages.length; i++) {
        const image = newImages[i];

        try {
          // Buscar o arquivo original
          const file = files[i];

          // [TRATAMENTO COMPLETO 2025] Tratar imagem com IA (remoção de fundo + super resolução)
          console.log(`🔄 Iniciando tratamento completo da imagem: ${file.name}`);
          const resultadoTratamento = await iaService.tratarImagemComIA(file);

          if (resultadoTratamento.success) {
            // Criar URL para a imagem final (sem fundo + escalada + otimizada)
            const processedUrl = URL.createObjectURL(resultadoTratamento.imagem);

            console.log(`✅ Tratamento completo finalizado: ${file.name}`, {
              original: resultadoTratamento.tamanhoOriginal,
              final: resultadoTratamento.tamanhoFinal,
              qualidade: resultadoTratamento.qualidade
            });

            setUploadedImages(prev => prev.map(img =>
              img.id === image.id
                ? {
                  ...img,
                  processedUrl,
                  status: 'completed' as const,
                  name: `${file.name} (Tratada com IA)`
                }
                : img
            ));
          } else {
            // Fallback: usar imagem original se tratamento falhar
            console.warn(`⚠️ Falha no tratamento completo, usando imagem original: ${file.name}`);
            setUploadedImages(prev => prev.map(img =>
              img.id === image.id
                ? { ...img, status: 'completed' as const }
                : img
            ));
          }

        } catch (error) {
          console.error(`❌ Erro ao processar imagem ${image.name}:`, error);
          setUploadedImages(prev => prev.map(img =>
            img.id === image.id
              ? { ...img, status: 'error' as const }
              : img
          ));
        }
      }

      setSucesso(`${newImages.length} imagem(ns) processada(s) com IA!`);
      setTimeout(() => setSucesso(null), 3000);

    } catch (error) {
      console.error("Erro no processamento de imagens:", error);
      setErro("Erro no processamento de imagens. Tente novamente.");
      setTimeout(() => setErro(null), 5000);
    } finally {
      setIsProcessingImages(false);
    }
  };

  // Função para gerar anúncio completo com IA
  const handleGerarAnuncioCompleto = async () => {
    // Validar campos obrigatórios
    if (!dadosPeca.peca || !dadosPeca.veiculo || !dadosPeca.ano) {
      setErro("Preencha todos os campos obrigatórios!");
      setTimeout(() => setErro(null), 3000);
      return;
    }

    setIsGerandoAnuncio(true);
    setErro(null);
    setSucesso(null);

    try {
      // Salvar versão anterior no histórico
      if (resultadoAnuncio) {
        setHistoricoGeracoes(prev => [resultadoAnuncio, ...prev.slice(0, 4)]);
      }

      // Limpar resultado anterior
      setResultadoAnuncio(null);

      // Gerar anúncio com IA
      const resultado = await anuncioService.gerarAnuncioCompleto({
        peca: dadosPeca.peca,
        veiculo: dadosPeca.veiculo,
        ano: dadosPeca.ano,
        lado: dadosPeca.lado || undefined,
        condicao: dadosPeca.condicao
      });

      setResultadoAnuncio(resultado);
      setSucesso("Anúncio gerado com IA com sucesso!");
      setTimeout(() => setSucesso(null), 3000);
      console.log("🤖 Anúncio completo gerado:", resultado);

    } catch (error) {
      console.error("Erro na geração de anúncio:", error);
      setErro("Erro na geração de anúncio. Tente novamente.");
      setTimeout(() => setErro(null), 5000);
    } finally {
      setIsGerandoAnuncio(false);
    }
  };

  // Função para ver última geração
  const handleVerUltimaGeracao = () => {
    if (historicoGeracoes.length > 0) {
      setResultadoAnuncio(historicoGeracoes[0]);
      setSucesso("Última geração restaurada!");
      setTimeout(() => setSucesso(null), 3000);
    }
  };

  // Função para criar ZIP para Mercado Livre
  const handleCriarZIP = async () => {
    if (!resultadoAnuncio) {
      setErro("Gere o anúncio com IA primeiro!");
      setTimeout(() => setErro(null), 3000);
      return;
    }

    if (uploadedImages.length === 0) {
      setErro("Adicione pelo menos 2 imagens!");
      setTimeout(() => setErro(null), 3000);
      return;
    }

    setIsCreatingZIP(true);
    setErro(null);

    try {
      // Converter imagens para base64
      const imagensBase64: string[] = [];

      for (const img of uploadedImages) {
        try {
          // Converter blob URL para base64
          const response = await fetch(img.processedUrl);
          const blob = await response.blob();

          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          imagensBase64.push(base64);
        } catch (error) {
          console.error(`Erro ao converter imagem ${img.name}:`, error);
          // Usar URL original como fallback
          imagensBase64.push(img.processedUrl);
        }
      }

      // Usar o serviço de anúncios para criar o ZIP
      const zipRequest = {
        titulo: resultadoAnuncio.titulo,
        descricao: resultadoAnuncio.descricao.join('\n'),
        preco: parseFloat(resultadoAnuncio.preco_sugerido),
        sku: `SKU-${dadosPeca.peca.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
        imagens: imagensBase64
      };

      const blob = await anuncioService.criarZIPMercadoLivre(zipRequest);

      // Baixar o ZIP criado pelo backend
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anuncio-${dadosPeca.peca.replace(/\s+/g, '-')}-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSucesso("ZIP criado e baixado com sucesso!");
      setTimeout(() => setSucesso(null), 3000);

    } catch (error) {
      console.error("Erro ao criar ZIP:", error);
      setErro("Erro ao criar ZIP. Tente novamente.");
      setTimeout(() => setErro(null), 5000);
    } finally {
      setIsCreatingZIP(false);
    }
  };

  // Função para publicar no Shopify
  const handlePublicarShopify = async () => {
    if (!resultadoAnuncio) {
      setErro("Gere o anúncio com IA primeiro!");
      setTimeout(() => setErro(null), 3000);
      return;
    }

    setIsPublishingShopify(true);
    setErro(null);

    try {
      // Chamada real para publicação no Shopify
      const dadosAnuncio = {
        titulo: resultadoAnuncio.titulo,
        descricao: resultadoAnuncio.descricao,
        preco: resultadoAnuncio.preco_sugerido,
        categoria: dadosPeca.peca,
        imagens: uploadedImages.filter(img => img.status === 'completed').map(img => img.processedUrl),
        tags: resultadoAnuncio.palavras_chave || [],
        estoque: formData.estoque || 1
      };

      const response = await anuncioService.publicarShopify(dadosAnuncio);

      if (response.success) {
        setSucesso("Anúncio publicado no Shopify com sucesso!");
        setTimeout(() => setSucesso(null), 3000);
      } else {
        throw new Error(response.message || 'Erro na publicação');
      }

    } catch (error) {
      console.error("Erro ao publicar no Shopify:", error);
      setErro("Erro ao publicar no Shopify. Tente novamente.");
      setTimeout(() => setErro(null), 5000);
    } finally {
      setIsPublishingShopify(false);
    }
  };

  return (
    <ProtectedRoute>
      <LayoutAnuncios>
        {/* Feedback Messages */}
        {sucesso && <FeedbackMessage type="success" message={sucesso} />}
        {erro && <FeedbackMessage type="error" message={erro} />}

        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header Premium */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <Wand2 className="w-12 h-12" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Criar Anúncio com IA</h1>
                <p className="text-blue-100 opacity-90">Sistema inteligente para criação de anúncios otimizados</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário Principal */}
            <div className="lg:col-span-2 space-y-6">

              {/* Upload de Imagens */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Camera className="w-6 h-6 text-blue-600" />
                  Upload de Imagens (2-6 imagens)
                </h3>

                <div className="space-y-4">
                  {/* Área de Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isProcessingImages}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {isProcessingImages ? (
                        <div className="flex items-center justify-center gap-3">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                          <div>
                            <p className="text-blue-600 font-medium">Processando com IA...</p>
                            <p className="text-sm text-gray-500">Removendo fundo das imagens</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-700 mb-2">
                            Clique para fazer upload ou arraste as imagens
                          </p>
                          <p className="text-sm text-gray-500">
                            Mínimo 2, máximo 6 imagens • A IA irá remover o fundo automaticamente
                          </p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Preview das Imagens */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.processedUrl}
                            alt={image.name}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors"
                          />
                          <div className="absolute top-2 right-2">
                            {image.status === 'processing' && (
                              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                            )}
                            {image.status === 'completed' && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            {image.status === 'error' && (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <button
                            onClick={() => setUploadedImages(prev => prev.filter(img => img.id !== image.id))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Criação de Anúncio com IA */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Bot className="w-6 h-6 text-purple-600" />
                  Criação de Anúncio com IA
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2">Nome da Peça *</label>
                      <input
                        type="text"
                        value={dadosPeca.peca}
                        onChange={(e) => setDadosPeca(prev => ({ ...prev, peca: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Porta Traseira"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2">Modelo do Carro *</label>
                      <input
                        type="text"
                        value={dadosPeca.veiculo}
                        onChange={(e) => setDadosPeca(prev => ({ ...prev, veiculo: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Fiesta"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2">Ano *</label>
                      <input
                        type="text"
                        value={dadosPeca.ano}
                        onChange={(e) => setDadosPeca(prev => ({ ...prev, ano: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: 2014"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2">Lado (se aplicável)</label>
                      <input
                        type="text"
                        value={dadosPeca.lado}
                        onChange={(e) => setDadosPeca(prev => ({ ...prev, lado: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Direito"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-2">Condição da Peça</label>
                      <select
                        value={dadosPeca.condicao}
                        onChange={(e) => setDadosPeca(prev => ({ ...prev, condicao: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Usado Original com Avaria Leve">Usado Original com Avaria Leve</option>
                        <option value="Usado Original">Usado Original</option>
                        <option value="Usado com Avaria">Usado com Avaria</option>
                        <option value="Seminovo">Seminovo</option>
                        <option value="Novo">Novo</option>
                      </select>
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleGerarAnuncioCompleto}
                      disabled={isGerandoAnuncio || !dadosPeca.peca || !dadosPeca.veiculo || !dadosPeca.ano}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGerandoAnuncio ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Gerando com IA...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Gerar com IA
                        </>
                      )}
                    </button>

                    {historicoGeracoes.length > 0 && (
                      <button
                        onClick={handleVerUltimaGeracao}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg flex items-center gap-2"
                      >
                        <Bot className="w-4 h-4" />
                        Ver Última Geração
                      </button>
                    )}
                  </div>

                  {/* Resultado do Anúncio Completo */}
                  {resultadoAnuncio && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                      <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <Wand2 className="w-5 h-5" />
                        Anúncio Gerado com IA (Score: {resultadoAnuncio.score_qualidade}%)
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <span className="font-medium text-blue-700">Título Otimizado:</span>
                          <p className="text-blue-600 bg-white p-3 rounded-lg border border-blue-200 mt-1 font-semibold">
                            {resultadoAnuncio.titulo}
                          </p>
                        </div>

                        <div>
                          <span className="font-medium text-blue-700">Preço Sugerido:</span>
                          <p className="text-blue-600 font-bold text-lg">
                            R$ {resultadoAnuncio.preco_sugerido}
                          </p>
                        </div>

                        <div>
                          <span className="font-medium text-blue-700">Descrição Estruturada:</span>
                          <div className="bg-white p-3 rounded-lg border border-blue-200 mt-1">
                            {resultadoAnuncio.descricao.map((item: string, index: number) => (
                              <p key={index} className="text-blue-600 mb-2 last:mb-0">
                                {item}
                              </p>
                            ))}
                          </div>
                        </div>

                        {resultadoAnuncio.analise_mercado_livre && (
                          <div>
                            <span className="font-medium text-blue-700">Análise do Mercado Livre:</span>
                            <div className="bg-white p-3 rounded-lg border border-blue-200 mt-1 space-y-2">
                              <p className="text-sm text-blue-600">
                                <strong>Títulos similares:</strong> {resultadoAnuncio.analise_mercado_livre.titulos_similares.slice(0, 2).join(', ')}
                              </p>
                              <p className="text-sm text-blue-600">
                                <strong>Preços médios:</strong> R$ {Math.round(resultadoAnuncio.analise_mercado_livre.precos_medios.reduce((a: number, b: number) => a + b, 0) / resultadoAnuncio.analise_mercado_livre.precos_medios.length).toLocaleString('pt-BR')}
                              </p>
                              <p className="text-sm text-blue-600">
                                <strong>Palavras-chave:</strong> {resultadoAnuncio.analise_mercado_livre.palavras_chave.slice(0, 3).join(', ')}
                              </p>
                            </div>
                          </div>
                        )}

                        {resultadoAnuncio.tags_sugeridas && (
                          <div>
                            <span className="font-medium text-blue-700">Tags Sugeridas:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {resultadoAnuncio.tags_sugeridas.map((tag: string, index: number) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Botão para exibir análise de concorrência */}
                        {resultadoAnuncio.rastreio_origem && (
                          <div className="mt-4">
                            <button
                              onClick={() => setMostrarRastreio(true)}
                              className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              👁 Ver análise de concorrência
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ações Finais */}
              {resultadoAnuncio && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-green-600" />
                    Ações Finais
                  </h3>

                  <div className="space-y-4">
                    {/* Checkbox para Shopify */}
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.canais_publicacao.shopify}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          canais_publicacao: { ...prev.canais_publicacao, shopify: e.target.checked }
                        }))}
                        className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
                      />
                      <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                      <span className="font-medium">Postar automaticamente no Shopify</span>
                    </label>

                    {/* Botões de ação */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleCriarZIP}
                        disabled={isCreatingZIP}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isCreatingZIP ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Criando ZIP...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Baixar ZIP para Mercado Livre
                          </>
                        )}
                      </button>

                      <button
                        onClick={handlePublicarShopify}
                        disabled={isPublishingShopify || !formData.canais_publicacao.shopify}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isPublishingShopify ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Publicando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Publicar no Shopify
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Informativa */}
            <div className="space-y-6">
              {/* Status do Processamento */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Status do Processamento
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Imagens:</span>
                    <span className="font-bold text-blue-800">{uploadedImages.length}/6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Processadas:</span>
                    <span className="font-bold text-blue-800">
                      {uploadedImages.filter(img => img.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">IA Gerada:</span>
                    <span className="font-bold text-blue-800">
                      {resultadoAnuncio ? '✅' : '❌'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resultado da IA */}
              {resultadoAnuncio && (
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                  <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Análise da IA
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-700">Score de Qualidade:</span>
                      <span className="font-bold text-purple-800">{resultadoAnuncio.score_qualidade}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${resultadoAnuncio.score_qualidade}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-purple-600">
                      {resultadoAnuncio.score_qualidade >= 80 ? "Excelente qualidade!" :
                        resultadoAnuncio.score_qualidade >= 60 ? "Boa qualidade" : "Considere melhorias"}
                    </div>
                  </div>
                </div>
              )}

              {/* Dicas */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Dicas de Otimização
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>• Use a IA para gerar conteúdo otimizado</div>
                  <div>• Adicione pelo menos 2 imagens de qualidade</div>
                  <div>• Títulos baseados no Mercado Livre</div>
                  <div>• Descrições detalhadas e atrativas</div>
                  <div>• Preços competitivos e realistas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Componente de Preview */}
        {showPreview && resultadoAnuncio && (
          <PreviewAnuncio
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            anuncio={{
              titulo: resultadoAnuncio.titulo,
              descricao: resultadoAnuncio.descricao.join('\n'),
              preco: parseFloat(resultadoAnuncio.preco_sugerido),
              imagens: uploadedImages.map(img => img.processedUrl),
              tags: resultadoAnuncio.tags_sugeridas || [],
              categoria: dadosPeca.peca,
              marca: dadosPeca.condicao,
              modelo_veiculo: dadosPeca.veiculo,
              ano_veiculo: dadosPeca.ano
            }}
          />
        )}

        {/* Componente de Rastreamento de Concorrência */}
        {resultadoAnuncio && resultadoAnuncio.rastreio_origem && (
          <RastreamentoConcorrencia
            rastreio={resultadoAnuncio.rastreio_origem}
            isOpen={mostrarRastreio}
            onClose={() => setMostrarRastreio(false)}
          />
        )}
      </LayoutAnuncios>
    </ProtectedRoute>
  );
} 