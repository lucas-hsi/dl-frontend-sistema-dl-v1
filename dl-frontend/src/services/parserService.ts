import { api } from '@/config/api';

export interface DocumentClassification {
  filename?: string;
  mime_type: string;
  document_type: string;
  content_analysis: {
    has_text: boolean;
    has_tables: boolean;
    has_images: boolean;
    encoding: string;
  };
  file_size: number;
  supported: boolean;
  error?: string;
}

export interface ParsedXML {
  type: string;
  xml_type: string;
  root_tag: string;
  attributes: Record<string, string>;
  elements_count: number;
  parsed_data: {
    type: string;
    elements: Record<string, string>;
    attributes: Record<string, any>;
    nfe_info?: Record<string, any>;
    sped_info?: Record<string, any>;
  };
  raw_content: string;
  error?: string;
}

export interface ParsedPDF {
  type: string;
  parsed_data: {
    pages_count: number;
    metadata?: Record<string, any>;
    is_encrypted?: boolean;
    text_content: Array<{
      page: number;
      text: string;
    }>;
  };
  file_size: number;
  error?: string;
}

export interface ParsedSpreadsheet {
  type: string;
  file_type?: string;
  sheets_count?: number;
  sheet_names?: string[];
  sheets_data?: Record<string, {
    rows_count: number;
    columns_count: number;
    columns: string[];
    sample_data: Record<string, any>[];
    data_types: Record<string, string>;
  }>;
  workbook_properties?: {
    title?: string;
    creator?: string;
    created?: string;
    modified?: string;
  };
  // Para CSV
  rows_count?: number;
  columns_count?: number;
  columns?: string[];
  sample_data?: Record<string, any>[];
  data_types?: Record<string, string>;
  delimiter?: string;
  error?: string;
}

export interface SupportedFormats {
  xml: string[];
  pdf: string[];
  xlsx: string[];
  xls: string[];
  csv: string[];
  txt: string[];
}

class ParserService {
  private baseUrl = '/parser';

  // Upload e classificação de documento
  async uploadDocument(file: File): Promise<DocumentClassification> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload do documento:', error);
      throw error;
    }
  }

  // Parse específico de XML
  async parseXML(file: File): Promise<ParsedXML> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`${this.baseUrl}/parse-xml`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer parse do XML:', error);
      throw error;
    }
  }

  // Parse específico de PDF
  async parsePDF(file: File): Promise<ParsedPDF> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`${this.baseUrl}/parse-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer parse do PDF:', error);
      throw error;
    }
  }

  // Parse específico de planilha
  async parseSpreadsheet(file: File): Promise<ParsedSpreadsheet> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`${this.baseUrl}/parse-spreadsheet`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer parse da planilha:', error);
      throw error;
    }
  }

  // Obter formatos suportados
  async getSupportedFormats(): Promise<SupportedFormats> {
    try {
      const response = await api.get(`${this.baseUrl}/supported-formats`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter formatos suportados:', error);
      throw error;
    }
  }

  // Helper para detectar tipo de arquivo
  detectFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'xml':
        return 'xml';
      case 'pdf':
        return 'pdf';
      case 'xlsx':
        return 'xlsx';
      case 'xls':
        return 'xls';
      case 'csv':
        return 'csv';
      case 'txt':
        return 'txt';
      default:
        return 'unknown';
    }
  }

  // Helper para validar tamanho do arquivo
  validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  // Helper para formatar tamanho do arquivo
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Helper para extrair informações básicas do arquivo
  getFileInfo(file: File) {
    return {
      name: file.name,
      size: file.size,
      sizeFormatted: this.formatFileSize(file.size),
      type: file.type,
      lastModified: new Date(file.lastModified),
      extension: file.name.split('.').pop()?.toLowerCase()
    };
  }
}

export const parserService = new ParserService(); 