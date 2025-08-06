import axios from 'axios';
import { API_CONFIG } from '@/config/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Interceptor para debug de requisições
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Requisição:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para debug de respostas
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', error.response?.status, error.config?.url);
    console.error('🔍 Detalhes do erro:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface Sucata {
  id: number;
  sku_mestre: string;
  identificador_veiculo: string;
  valor_pago: number;
  status: string;
  criado_em: string;
}

export interface CanaisPublicacao {
  mercado_livre: boolean;
  shopify: boolean;
  site_proprio: boolean;
}

export interface AnuncioFormData {
  sucata_vinculada?: string; // Opcional agora
  nome_produto: string;
  categoria: string;
  marca?: string;
  modelo_veiculo?: string;
  ano_veiculo?: string;
  descricao?: string;
  preco: number;
  estoque: number;
  tags: string[];
  imagens: string[];
  canais_publicacao: CanaisPublicacao;
  sku_gerado?: string; // SKU único gerado automaticamente
}

export interface Anuncio {
  id: number;
  sucata_vinculada?: string; // Opcional agora
  sku_gerado: string; // SKU único obrigatório
  nome_produto: string;
  categoria: string;
  marca?: string;
  modelo_veiculo?: string;
  ano_veiculo?: string;
  descricao?: string;
  preco: number;
  estoque: number;
  tags: string[];
  imagens: string[];
  canais_publicacao: CanaisPublicacao;
  status: string;
  score_ia?: number;
  criado_em: string;
  atualizado_em?: string;
}

export interface GeracaoIARequest {
  sucata_vinculada?: string; // Opcional agora
  categoria: string;
  nome_produto?: string;
}

export interface GeracaoIAResponse {
  nome_produto: string;
  descricao: string;
  preco_sugerido: number;
  tags_sugeridas: string[];
  score_qualidade: number;
  analise_mercado_livre?: {
    titulos_similares: string[];
    precos_medios: number[];
    palavras_chave: string[];
  };
  rastreio_origem?: {
    modelo_detectado?: string;
    compatibilidade?: string;
    argumento_destaque?: string;
    garantia?: string;
    preco_base?: string;
    qualidade_analise?: string;
    dados_tecnicos?: string;
  };
}

export interface CriacaoZIPRequest {
  titulo: string;
  descricao: string;
  preco: number;
  sku: string;
  imagens: string[];
}

export interface PublicacaoShopifyRequest {
  titulo: string;
  descricao: string;
  preco: number;
  imagens: string[];
  tags: string[];
}

export interface ProcessamentoImagemRequest {
  imagem_base64: string;
  nome_arquivo: string;
}

export interface ProcessamentoImagemResponse {
  imagem_processada_url: string;
  sucesso: boolean;
  mensagem: string;
}

export interface BuscaAnunciosResponse {
  anuncios: Anuncio[];
  total: number;
  filtros_aplicados: {
    sku?: string;
    nome?: string;
    carro?: string;
    categoria?: string;
  };
}

export interface OtimizacaoIA {
  titulo_original: string;
  titulo_otimizado: string;
  preco_original: number;
  preco_otimizado: number;
  score_melhoria: number;
  sugestoes: string[];
}

export interface PublicacaoML {
  anuncio_id: number;
  ml_id: string;
  url: string;
  status: string;
  preco_publicado: number;
  estoque_publicado: number;
}

export interface SincronizacaoML {
  total_anuncios: number;
  sincronizados: number;
  erros: number;
  produtos_sincronizados: number;
  total_encontrados: number;
  detalhes: Array<{
    anuncio_id: number;
    status: string;
    preco_atualizado?: number;
    estoque_atualizado?: number;
    erro?: string;
  }>;
}

export interface RelatoriosAnuncios {
  periodo: string;
  canal?: string;
  metricas: {
    total_anuncios: number;
    anuncios_ativos: number;
    vendas_totais: number;
    receita_total: number;
    conversoes: number;
    cliques: number;
    visualizacoes: number;
  };
  performance_por_canal: {
    mercado_livre: {
      anuncios: number;
      vendas: number;
      receita: number;
      conversoes: number;
    };
    shopify: {
      anuncios: number;
      vendas: number;
      receita: number;
      conversoes: number;
    };
    site_proprio: {
      anuncios: number;
      vendas: number;
      receita: number;
      conversoes: number;
    };
  };
  top_produtos: Array<{
    nome: string;
    vendas: number;
    receita: number;
  }>;
}

class AnuncioService {

  // Listar anúncios
  async listarAnuncios(skip: number = 0, limit: number = 100): Promise<Anuncio[]> {
    try {
      const url = `/anuncios?skip=${skip}&limit=${limit}`;
      console.log('📡 Requisição para:', url);
      console.log('🔧 Base URL:', API_CONFIG.BASE_URL);

      const response = await api.get(url);
      console.log('✅ Resposta recebida:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar anúncios:', error);
      console.error('📡 URL da requisição:', `${API_CONFIG.BASE_URL}/anuncios?skip=${skip}&limit=${limit}`);
      console.error('🔧 Configuração da API:', API_CONFIG);

      if (error.response) {
        // Erro de resposta do servidor
        throw new Error(`Erro ao carregar anúncios: ${error.response.status} - ${error.response.data?.detail || error.message}`);
      } else if (error.request) {
        // Erro de rede
        throw new Error(`Erro de conexão: ${error.message || 'Servidor não respondeu'}`);
      } else {
        // Outro erro
        throw new Error(`Erro ao carregar anúncios: ${error.message || 'Erro desconhecido'}`);
      }
    }
  }

  // Buscar anúncios
  async buscarAnuncios(
    sku?: string,
    nome?: string,
    carro?: string,
    categoria?: string,
    skip: number = 0,
    limit: number = 50
  ): Promise<BuscaAnunciosResponse> {
    try {
      const params = new URLSearchParams();
      if (sku) params.append('sku', sku);
      if (nome) params.append('nome', nome);
      if (carro) params.append('carro', carro);
      if (categoria) params.append('categoria', categoria);
      params.append('skip', skip.toString());
      params.append('limit', limit.toString());

      const url = `/anuncios/buscar?${params.toString()}`;
      console.log('📡 Buscando anúncios:', url);

      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar anúncios:', error);
      throw new Error(`Erro ao buscar anúncios: ${error.message || 'Erro desconhecido'}`);
    }
  }

  // Obter anúncio específico
  async obterAnuncio(id: number): Promise<Anuncio> {
    try {
      const response = await api.get(`/anuncios/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao obter anúncio:', error);
      throw new Error(`Erro ao carregar anúncio: ${error.message || 'Erro desconhecido'}`);
    }
  }

  // Criar anúncio
  // Gerar SKU único
  private gerarSKUUnico(nomeProduto: string, categoria: string, sucataVinculada?: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const categoriaCode = categoria.substring(0, 3).toUpperCase();
    const nomeCode = nomeProduto.substring(0, 3).toUpperCase().replace(/\s/g, '');

    if (sucataVinculada) {
      // SKU vinculado à sucata
      const sucataCode = sucataVinculada.split('-')[1] || '000';
      return `SKU-${categoriaCode}-${sucataCode}-${timestamp}`;
    } else {
      // SKU independente
      return `SKU-${categoriaCode}-${nomeCode}-${timestamp}`;
    }
  }

  async criarAnuncio(anuncioData: AnuncioFormData): Promise<Anuncio> {
    try {
      // Gerar SKU único antes de enviar
      const skuGerado = this.gerarSKUUnico(
        anuncioData.nome_produto,
        anuncioData.categoria,
        anuncioData.sucata_vinculada
      );

      const dadosComSKU = {
        ...anuncioData,
        sku_gerado: skuGerado
      };

      const response = await api.post('/anuncios', dadosComSKU);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar anúncio:', error);
      throw new Error(`Erro ao criar anúncio: ${error.message || 'Erro desconhecido'}`);
    }
  }

  // Atualizar anúncio
  async atualizarAnuncio(id: number, anuncioData: Partial<AnuncioFormData>): Promise<Anuncio> {
    try {
      const response = await api.put(`/anuncios/${id}`, anuncioData);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar anúncio:', error);
      throw new Error(`Erro ao atualizar anúncio: ${error.message || 'Erro desconhecido'}`);
    }
  }

  // Deletar anúncio
  async deletarAnuncio(id: number): Promise<void> {
    try {
      await api.delete(`/anuncios/${id}`);
    } catch (error: any) {
      console.error('❌ Erro ao deletar anúncio:', error);
      throw new Error(`Erro ao deletar anúncio: ${error.message || 'Erro desconhecido'}`);
    }
  }

  // Listar sucatas
  async listarSucatas(): Promise<Sucata[]> {
    try {
      console.log('🔄 Tentando buscar sucatas do backend...');
      const response = await api.get('/sucatas/');

      if (response.status === 200) {
        const data = response.data;
        console.log('✅ Sucatas carregadas com sucesso:', data.length, 'sucatas');
        return data;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('❌ Erro ao buscar sucatas:', error);
      console.error('🔍 Detalhes do erro:', error.response?.data || error.message);

      // Retornar dados mock em caso de erro
      console.log('🔄 Usando dados mock para sucatas...');
      return [
        {
          id: 1,
          sku_mestre: "SC-4B32-241025-0001",
          identificador_veiculo: "Honda Civic 2018 - ABC4B32",
          valor_pago: 2500,
          status: "disponivel",
          criado_em: new Date().toISOString()
        },
        {
          id: 2,
          sku_mestre: "SC-7Y89-241020-0002",
          identificador_veiculo: "Toyota Corolla 2016 - XYZ7Y89",
          valor_pago: 1800,
          status: "disponivel",
          criado_em: new Date().toISOString()
        },
        {
          id: 3,
          sku_mestre: "SC-2A15-241015-0003",
          identificador_veiculo: "Ford Focus 2019 - DEF2A15",
          valor_pago: 2200,
          status: "disponivel",
          criado_em: new Date().toISOString()
        },
        {
          id: 4,
          sku_mestre: "SC-9K47-241010-0004",
          identificador_veiculo: "Volkswagen Golf 2017 - GHI9K47",
          valor_pago: 1900,
          status: "disponivel",
          criado_em: new Date().toISOString()
        },
        {
          id: 5,
          sku_mestre: "SC-3M12-241005-0005",
          identificador_veiculo: "Chevrolet Onix 2020 - JKL3M12",
          valor_pago: 2100,
          status: "disponivel",
          criado_em: new Date().toISOString()
        }
      ];
    }
  }

  // Gerar conteúdo com IA
  async gerarConteudoIA(request: GeracaoIARequest): Promise<GeracaoIAResponse> {
    try {
      console.log('🤖 Enviando requisição para IA:', request);
      const response = await api.post(`/anuncios/gerar-ia/`, request);
      console.log('✅ Resposta da IA:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na geração com IA:', error);
      console.error('📋 Payload enviado:', request);
      console.error('🔍 Detalhes do erro:', error.response?.data);

      // Retornar dados mock em caso de erro
      console.log('🔄 Usando dados mock para IA...');

      const nomeProduto = request.nome_produto || `Peça ${request.categoria}`;
      const precoBase = request.sucata_vinculada ? 150 : 120;

      return {
        nome_produto: `${nomeProduto.toUpperCase()} ${request.categoria.toUpperCase()} ORIGINAL`,
        descricao: `🔧 ${nomeProduto} de alta qualidade\n\n✅ Características:\n• Material premium\n• Garantia de 12 meses\n• Entrega rápida\n• Compatível com diversos modelos\n\n🚗 Aplicação: ${request.categoria}\n\n💯 Qualidade garantida pela DL Auto Peças`,
        preco_sugerido: precoBase,
        tags_sugeridas: [
          request.categoria.toLowerCase(),
          "original",
          "garantia",
          "qualidade",
          "entrega_rapida",
          "dl_auto_pecas"
        ],
        score_qualidade: 85,
        analise_mercado_livre: {
          titulos_similares: [
            `${nomeProduto.toUpperCase()} ${request.categoria.toUpperCase()} ORIGINAL`,
            `${nomeProduto.toUpperCase()} ${request.categoria.toUpperCase()} SEM DETALHE`,
            `${nomeProduto.toUpperCase()} ${request.categoria.toUpperCase()} COM AVARIA`
          ],
          precos_medios: [150, 200, 180, 220, 160],
          palavras_chave: [nomeProduto, request.categoria, "Original", "Autopeças"]
        }
      };
    }
  }

  // Gerar anúncio completo com IA (nova funcionalidade)
  async gerarAnuncioCompleto(dados: {
    peca: string;
    veiculo: string;
    ano: string;
    lado?: string;
    condicao?: string;
  }): Promise<{
    titulo: string;
    descricao: string[];
    preco_sugerido: string;
    analise_mercado_livre?: {
      titulos_similares: string[];
      precos_medios: number[];
      palavras_chave: string[];
    };
    score_qualidade: number;
    tags_sugeridas: string[];
  }> {
    try {
      console.log('🤖 Gerando anúncio completo com IA:', dados);
      const response = await api.post(`/anuncios/gerar-anuncio-completo/`, dados);
      console.log('✅ Anúncio completo gerado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na geração de anúncio completo:', error);
      console.error('📋 Dados enviados:', dados);
      console.error('🔍 Detalhes do erro:', error.response?.data);

      // Propagar o erro em vez de retornar dados mock
      throw new Error(`Erro na geração de anúncio: ${error.response?.data?.detail || error.message}`);
    }
  }

  // Criar ZIP para Mercado Livre
  async criarZIPMercadoLivre(request: CriacaoZIPRequest): Promise<Blob> {
    try {
      console.log('📦 Criando ZIP para Mercado Livre:', request);
      const response = await api.post(`/anuncios/criar-zip-ml/`, request, {
        responseType: 'blob'
      });
      console.log('✅ ZIP criado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar ZIP:', error);
      throw new Error('Erro ao criar ZIP para Mercado Livre');
    }
  }

  // Publicar no Shopify
  async publicarShopify(request: PublicacaoShopifyRequest): Promise<any> {
    try {
      console.log('🛒 Publicando no Shopify:', request);
      const response = await api.post(`/anuncios/publicar-shopify/`, request);
      console.log('✅ Publicação no Shopify realizada com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao publicar no Shopify:', error);
      throw new Error('Erro ao publicar no Shopify');
    }
  }

  // Otimizar anúncio com IA
  async otimizarAnuncioIA(anuncioId: number): Promise<OtimizacaoIA> {
    try {
      const response = await api.post(`/anuncios/ia/otimizar?anuncio_id=${anuncioId}`);
      return response.data.otimizacoes;
    } catch (error) {
      console.error('Erro na otimização com IA:', error);
      throw new Error('Erro na otimização com IA');
    }
  }

  // Gerar descrição com IA
  async gerarDescricaoIA(anuncioId: number): Promise<string> {
    try {
      const response = await api.post(`/anuncios/gerar-descricao?anuncio_id=${anuncioId}`);
      return response.data.descricao_gerada;
    } catch (error) {
      console.error('Erro na geração de descrição:', error);
      throw new Error('Erro na geração de descrição');
    }
  }

  // Processar imagem
  async processarImagem(request: ProcessamentoImagemRequest): Promise<ProcessamentoImagemResponse> {
    try {
      const response = await api.post(`/anuncios/processar-imagem/`, request);
      return response.data;
    } catch (error) {
      console.error('Erro no processamento de imagem:', error);
      throw new Error('Erro no processamento de imagem');
    }
  }

  // Remover fundo da imagem
  async removerFundoImagem(anuncioId: number, imagemUrl: string): Promise<string> {
    try {
      const response = await api.post(`/anuncios/remover-fundo`, {
        anuncio_id: anuncioId,
        imagem_url: imagemUrl
      });
      return response.data.imagem_processada;
    } catch (error) {
      console.error('Erro na remoção de fundo:', error);
      throw new Error('Erro na remoção de fundo');
    }
  }

  // Upload de imagem
  async uploadImagem(file: File): Promise<ProcessamentoImagemResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/anuncios/upload-imagem/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.processamento;
    } catch (error) {
      console.error('Erro no upload de imagem:', error);
      throw new Error('Erro no upload de imagem');
    }
  }

  // Publicar no Mercado Livre
  async publicarMercadoLivre(anuncioId: number): Promise<PublicacaoML> {
    try {
      const response = await api.post(`/anuncios/publicar?anuncio_id=${anuncioId}`);
      return response.data.publicacao;
    } catch (error) {
      console.error('Erro na publicação no ML:', error);
      throw new Error('Erro na publicação no Mercado Livre');
    }
  }

  // Sincronizar com Mercado Livre
  async sincronizarMercadoLivre(): Promise<SincronizacaoML> {
    try {
      const response = await api.post(`/anuncios/sincronizar-ml`);
      return response.data.sincronizacao;
    } catch (error) {
      console.error('Erro na sincronização com ML:', error);
      throw new Error('Erro na sincronização com Mercado Livre');
    }
  }

  // Sincronizar com Mercado Livre (versão real)
  async sincronizarMercadoLivreReal(): Promise<any> {
    try {
      console.log('🔄 Iniciando sincronização ML...', `${API_CONFIG.BASE_URL}/anuncios/ml/sincronizar`);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/anuncios/ml/sincronizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta:', response.status, errorData);
        throw new Error(`Erro HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Resposta da sincronização:', data);

      return data;
    } catch (error) {
      console.error('Erro na sincronização real com ML:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      }
      throw new Error('Erro na sincronização com Mercado Livre');
    }
  }

  // Buscar produtos no Mercado Livre
  async buscarProdutosML(query: string = "autopeças", limit: number = 50): Promise<any> {
    try {
      const response = await api.get(`/anuncios/ml/produtos`, {
        params: { query, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos no ML:', error);
      return { produtos: [], total: 0, query };
    }
  }

  // Obter detalhes de um produto do ML
  async obterProdutoML(mlId: string): Promise<any> {
    try {
      const response = await api.get(`/anuncios/ml/produto/${mlId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter produto do ML:', error);
      throw new Error('Erro ao obter produto do Mercado Livre');
    }
  }

  // Autenticar com Mercado Livre
  async autenticarML(accessToken: string): Promise<boolean> {
    try {
      const response = await api.post(`/anuncios/ml/autenticar?access_token=${encodeURIComponent(accessToken)}`);
      return response.data.autenticado;
    } catch (error) {
      console.error('Erro na autenticação ML:', error);
      throw new Error('Erro na autenticação com Mercado Livre');
    }
  }

  // Publicar produto no ML (versão real)
  async publicarProdutoMLReal(anuncioId: number): Promise<any> {
    try {
      const response = await api.post(`/anuncios/ml/publicar/${anuncioId}`);
      return response.data;
    } catch (error) {
      console.error('Erro na publicação real no ML:', error);
      throw new Error('Erro na publicação no Mercado Livre');
    }
  }

  // Buscar meus produtos no ML
  async buscarMeusProdutosML(): Promise<any> {
    try {
      const response = await api.get(`/anuncios/ml/meus-produtos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar meus produtos no ML:', error);
      return { produtos: [], produtos_encontrados: 0, vendedor: "erro" };
    }
  }

  // Obter status detalhado do ML
  async getMLStatusDetalhado(): Promise<any> {
    try {
      const response = await api.get(`/anuncios/ml/status-detalhado`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status detalhado do ML:', error);
      throw new Error('Erro ao verificar status do Mercado Livre');
    }
  }

  // Renovar token do ML
  async refreshMercadoLivreToken(): Promise<any> {
    try {
      const response = await api.post(`/anuncios/ml/refresh-token`);
      return response.data;
    } catch (error) {
      console.error('Erro ao renovar token do ML:', error);
      throw new Error('Erro ao renovar token do Mercado Livre');
    }
  }

  // Sincronizar TODOS os produtos do ML para o banco interno
  async sincronizarTodosProdutosParaBanco(): Promise<any> {
    try {
      console.log('🔄 Iniciando sincronização completa para banco...', `/anuncios/ml/sincronizar-para-banco`);
      const response = await api.post(`/anuncios/ml/sincronizar-para-banco`);
      console.log('✅ Resposta da sincronização completa:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro na sincronização completa:', error);
      throw new Error('Erro ao sincronizar produtos para banco interno');
    }
  }

  // Obter relatórios
  async obterRelatorios(periodo: string = 'mes', canal?: string): Promise<RelatoriosAnuncios> {
    try {
      const params = new URLSearchParams();
      params.append('periodo', periodo);
      if (canal) params.append('canal', canal);

      const response = await api.get(`/anuncios/relatorios?${params.toString()}`);
      return response.data.relatorios;
    } catch (error) {
      console.error('Erro ao obter relatórios:', error);
      throw new Error('Erro ao carregar relatórios');
    }
  }

  // Setup mock data
  async setupMockData(): Promise<void> {
    try {
      await api.post(`/anuncios/setup-mock/`);
    } catch (error) {
      console.error('Erro ao criar dados mock:', error);
      throw new Error('Erro ao criar dados mock');
    }
  }

  // Verificar status da IA
  async verificarStatusIA(): Promise<any> {
    try {
      const response = await api.get(`/anuncios/ia-status/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status da IA:', error);
      throw new Error('Erro ao verificar status da IA');
    }
  }

  // Converter arquivo para base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remover o prefixo "data:image/...;base64,"
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
}

export const anuncioService = new AnuncioService(); 
