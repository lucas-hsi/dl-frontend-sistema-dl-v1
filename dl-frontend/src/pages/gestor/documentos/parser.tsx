import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, FileImage, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import { parserService, DocumentClassification, ParsedXML, ParsedPDF, ParsedSpreadsheet } from '../../../services/parserService';

interface UploadedFile {
  file: File;
  classification?: DocumentClassification;
  parsedData?: ParsedXML | ParsedPDF | ParsedSpreadsheet;
  error?: string;
}

export default function ParserPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = async (files: File[]) => {
    setIsUploading(true);
    
    for (const file of files) {
      try {
        // Validar tamanho do arquivo
        if (!parserService.validateFileSize(file)) {
          setUploadedFiles(prev => [...prev, {
            file,
            error: 'Arquivo muito grande. Máximo 10MB.'
          }]);
          continue;
        }

        // Fazer upload e classificar
        const classification = await parserService.uploadDocument(file);
        
        // Parsear o documento
        let parsedData: any;
        if (classification.document_type === 'xml') {
          parsedData = await parserService.parseXML(file);
        } else if (classification.document_type === 'pdf') {
          parsedData = await parserService.parsePDF(file);
        } else if (['xlsx', 'xls', 'csv'].includes(classification.document_type)) {
          parsedData = await parserService.parseSpreadsheet(file);
        }

        setUploadedFiles(prev => [...prev, {
          file,
          classification,
          parsedData
        }]);

      } catch (error) {
        setUploadedFiles(prev => [...prev, {
          file,
          error: error instanceof Error ? error.message : 'Erro ao processar arquivo'
        }]);
      }
    }
    
    setIsUploading(false);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'xml': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'pdf': return <FileImage className="w-6 h-6 text-red-500" />;
      case 'xlsx':
      case 'xls':
      case 'csv': return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
      default: return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const renderParsedData = (data: ParsedXML | ParsedPDF | ParsedSpreadsheet, type: string) => {
    if (type === 'xml' && 'root' in data) {
      return (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Dados XML:</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
    }
    
    if (type === 'pdf') {
      const pdfData = data as ParsedPDF;
      return (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Dados PDF:</h4>
          <p className="text-sm">Páginas: {pdfData.parsed_data.pages_count}</p>
          <p className="text-sm">Texto extraído: {pdfData.parsed_data.text_content?.[0]?.text?.substring(0, 200)}...</p>
        </div>
      );
    }
    
    if (type === 'spreadsheet') {
      const spreadsheetData = data as ParsedSpreadsheet;
      return (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Dados Planilha:</h4>
          <p className="text-sm">Planilhas: {spreadsheetData.sheets_count || 0}</p>
          <p className="text-sm">Linhas: {spreadsheetData.rows_count || 0}</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Parser de Documentos</h1>
            <p className="text-blue-100">Faça upload de documentos para classificação e extração automática de dados</p>
            
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-200" />
                  <div>
                    <p className="text-2xl font-bold">{uploadedFiles.length}</p>
                    <p className="text-sm text-blue-100">Documentos</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-200" />
                  <div>
                    <p className="text-2xl font-bold">
                      {uploadedFiles.filter(f => !f.error).length}
                    </p>
                    <p className="text-sm text-blue-100">Processados</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-8 h-8 text-red-200" />
                  <div>
                    <p className="text-2xl font-bold">
                      {uploadedFiles.filter(f => f.error).length}
                    </p>
                    <p className="text-sm text-blue-100">Erros</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="w-8 h-8 text-yellow-200" />
                  <div>
                    <p className="text-2xl font-bold">
                      {uploadedFiles.filter(f => f.classification?.document_type === 'xml').length}
                    </p>
                    <p className="text-sm text-blue-100">XML</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Arraste e solte arquivos aqui</h3>
              <p className="text-gray-600 mb-4">
                Ou clique para selecionar arquivos (XML, PDF, Excel, CSV)
              </p>
              
              <input
                type="file"
                multiple
                accept=".xml,.pdf,.xlsx,.xls,.csv"
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Selecionar Arquivos
              </label>
              
              {isUploading && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Processando arquivos...</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Formatos Suportados */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Formatos Suportados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                <FileText className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-semibold">XML</p>
                  <p className="text-sm text-gray-600">NF-e, SPED, outros</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl">
                <FileImage className="w-6 h-6 text-red-500" />
                <div>
                  <p className="font-semibold">PDF</p>
                  <p className="text-sm text-gray-600">Documentos, relatórios</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                <FileSpreadsheet className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-semibold">Planilhas</p>
                  <p className="text-sm text-gray-600">Excel, CSV</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Arquivos Processados */}
        <AnimatePresence>
          {uploadedFiles.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Documentos Processados</h3>
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`border rounded-xl p-4 ${
                      file.error ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.classification?.document_type || 'unknown')}
                        <div>
                          <p className="font-semibold">{file.file.name}</p>
                          <p className="text-sm text-gray-600">
                            {parserService.formatFileSize(file.file.size)}
                          </p>
                          {file.classification && (
                            <p className="text-xs text-blue-600">
                              Tipo: {file.classification.document_type.toUpperCase()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {file.error && (
                      <div className="mt-3 p-3 bg-red-100 rounded-lg">
                        <p className="text-sm text-red-700">{file.error}</p>
                      </div>
                    )}
                    
                    {file.parsedData && file.classification && (
                      <div className="mt-3">
                        {renderParsedData(file.parsedData, file.classification.document_type)}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 