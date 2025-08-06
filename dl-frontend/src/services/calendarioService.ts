import { API_CONFIG } from '@/config/api';

export interface EventoCalendario {
    id: number;
    uuid: string;
    titulo: string;
    descricao?: string;
    data_inicio: string;
    data_fim: string;
    data_lembrete?: string;
    categoria: string;
    tipo_evento: string;
    prioridade: string;
    status: string;
    concluido: boolean;
    recorrente: boolean;
    valor?: number;
    responsavel?: number;
    cliente_id?: number;
    tags?: string[];
    anexos?: AnexoCalendario[];
}

export interface AnexoCalendario {
    id: number;
    nome_original: string;
    tamanho_bytes: number;
    tipo_mime: string;
    url_download?: string;
}

export interface EstatisticasCalendario {
    total_eventos: number;
    eventos_hoje: number;
    eventos_semana: number;
    eventos_mes: number;
    eventos_vencidos: number;
    eventos_concluidos: number;
    valor_total_mes: number;
}

export interface EventoFormData {
    titulo: string;
    descricao?: string;
    data_inicio: string;
    data_fim: string;
    categoria: string;
    prioridade: string;
    valor?: number;
    notificar_email?: boolean;
    notificar_whatsapp?: boolean;
    tags?: string[];
}

export interface FiltrosEventos {
    data_inicio?: string;
    data_fim?: string;
    categoria?: string;
    prioridade?: string;
    busca_texto?: string;
    apenas_vencidos?: boolean;
    apenas_proximos_vencimento?: boolean;
    limite?: number;
    offset?: number;
}

class CalendarioService {
    // Listar eventos com filtros
    async listarEventos(filtros: FiltrosEventos) {
        try {
            const params = new URLSearchParams();

            Object.entries(filtros).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });

            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/eventos?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao carregar eventos');
            }

            return data;
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            throw error;
        }
    }

    // Obter estatísticas
    async obterEstatisticas(): Promise<EstatisticasCalendario> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/estatisticas`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao carregar estatísticas');
            }

            return data;
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            throw error;
        }
    }

    // Criar evento
    async criarEvento(evento: EventoFormData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/eventos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evento),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao criar evento');
            }

            return data;
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            throw error;
        }
    }

    // Atualizar evento
    async atualizarEvento(id: number, evento: EventoFormData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/eventos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evento),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao atualizar evento');
            }

            return data;
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            throw error;
        }
    }

    // Deletar evento
    async deletarEvento(id: number) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/eventos/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao deletar evento');
            }

            return data;
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
            throw error;
        }
    }

    // Marcar como concluído
    async marcarConcluido(id: number) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/eventos/${id}/concluir`, {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao marcar como concluído');
            }

            return data;
        } catch (error) {
            console.error('Erro ao marcar como concluído:', error);
            throw error;
        }
    }

    // Categorizar com IA
    async categorizarComIA(titulo: string, descricao: string = '') {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/ia/categorizar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo, descricao }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao categorizar com IA');
            }

            return data;
        } catch (error) {
            console.error('Erro ao categorizar com IA:', error);
            throw error;
        }
    }

    // Sugerir lembretes
    async sugerirLembretes(data_inicio: string, data_fim: string, categoria: string) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/ia/sugerir-lembretes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data_inicio, data_fim, categoria }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao sugerir lembretes');
            }

            return data;
        } catch (error) {
            console.error('Erro ao sugerir lembretes:', error);
            throw error;
        }
    }

    // Analisar sentimento
    async analisarSentimento(titulo: string, descricao: string = '') {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/ia/analisar-sentimento`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo, descricao }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao analisar sentimento');
            }

            return data;
        } catch (error) {
            console.error('Erro ao analisar sentimento:', error);
            throw error;
        }
    }

    // Upload de anexo
    async uploadAnexo(eventoId: number, arquivo: File, dados: any) {
        try {
            const formData = new FormData();
            formData.append('arquivo', arquivo);
            formData.append('descricao', dados.descricao || '');
            formData.append('categoria', dados.categoria || 'documento');
            formData.append('tipo_anexo', dados.tipo_anexo || '');
            formData.append('metadados', JSON.stringify(dados.metadados || {}));

            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/eventos/${eventoId}/anexos`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao fazer upload do anexo');
            }

            return data;
        } catch (error) {
            console.error('Erro ao fazer upload do anexo:', error);
            throw error;
        }
    }

    // Deletar anexo
    async deletarAnexo(anexoId: number) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/anexos/${anexoId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao deletar anexo');
            }

            return data;
        } catch (error) {
            console.error('Erro ao deletar anexo:', error);
            throw error;
        }
    }

    // Obter resumo para dashboard
    async obterResumoDashboard() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/calendario/dashboard/resumo`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao obter resumo do dashboard');
            }

            return data;
        } catch (error) {
            console.error('Erro ao obter resumo do dashboard:', error);
            throw error;
        }
    }
}

export default new CalendarioService(); 