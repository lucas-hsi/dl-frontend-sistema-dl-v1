import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Download,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Eye,
  Code,
  BarChart3
} from 'lucide-react';
import { parserService, DocumentClassification, ParsedXML, ParsedPDF, ParsedSpreadsheet, SupportedFormats } from '../../../services/parserService';

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ id, label, icon, active, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {icon}
    {label}
  </motion.button>
);

export default function ParserDocumentos() {
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [classification, setClassification] = useState<DocumentClassification | null>(null);
  const [parsedData, setParsedData] = useState<ParsedXML | ParsedPDF | ParsedSpreadsheet | null>(null);
  const [supportedFormats, setSupportedFormats] = useState<SupportedFormats | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'upload', label: 'Upload', icon: <Upload size={20} /> },
    { id: 'xml', label: 'XML', icon: <Code size={20} /> },
    { id: 'pdf', label: 'PDF', icon: <FileText size={20} /> },
    { id: 'spreadsheet', label: 'Planilhas', icon: <FileSpreadsheet size={20} /> },
    { id: 'formats', label: 'Formatos', icon: <Info size={20} /> }
  ];

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setUploadedFile(file);
    
    try {
      // Classificar documento
      const classificationResult = await parserService.uploadDocument(file);
      setClassification(classificationResult);
      
      // Fazer parse específico baseado no tipo
      if (classificationResult.document_type === 'xml') {
        const xmlData = await parserService.parseXML(file);
        setParsedData(xmlData);
      } else if (classificationResult.document_type === 'pdf') {
        const pdfData = await parserService.parsePDF(file);
        setParsedData(pdfData);
      } else if (['xlsx', 'xls', 'csv'].includes(classificationResult.document_type)) {
        const spreadsheetData = await parserService.parseSpreadsheet(file);
        setParsedData(spreadsheetData);
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'xml':
        return <Code className="text-blue-600" size={24} />;
      case 'pdf':
        return <FileText className="text-red-600" size={24} />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="text-green-600" size={24} />;
      case 'csv':
        return <FileSpreadsheet className="text-orange-600" size={24} />;
      default:
        return <FileText className="text-gray-600" size={24} />;
    }
  };

  const getStatusIcon = (supported: boolean) => {
    return supported ? <CheckCircle className="text-green-600" size={16} /> : <XCircle className="text-red-600" size={16} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl mx-4 mt-4 p-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Parser de Documentos</h1>
            <p className="text-blue-100">Análise inteligente de XML, PDF e planilhas</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold">5</div>
              <div className="text-blue-100 text-sm">Formatos Suportados</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">10MB</div>
              <div className="text-blue-100 text-sm">Tamanho Máximo</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mx-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-4 mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'upload' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Area */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl p-6"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload de Documento</h2>
                  
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Arraste um arquivo aqui ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-500">
                      Suporta XML, PDF, Excel e CSV (máx. 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xml,.pdf,.xlsx,.xls,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {uploadedFile && (
                    <motion.div 
                      className="mt-6 p-4 bg-blue-50 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(parserService.detectFileType(uploadedFile.name))}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                          <p className="text-sm text-gray-600">{parserService.formatFileSize(uploadedFile.size)}</p>
                        </div>
                        {loading && (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Classification Results */}
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl p-6"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Análise do Documento</h2>
                  
                  {classification ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Tipo de Documento</span>
                        <span className="text-blue-600 font-semibold">{classification.document_type.toUpperCase()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">MIME Type</span>
                        <span className="text-gray-600">{classification.mime_type}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Tamanho</span>
                        <span className="text-gray-600">{parserService.formatFileSize(classification.file_size)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Suportado</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(classification.supported)}
                          <span className={classification.supported ? 'text-green-600' : 'text-red-600'}>
                            {classification.supported ? 'Sim' : 'Não'}
                          </span>
                        </div>
                      </div>

                      {classification.content_analysis && (
                        <div className="mt-4">
                          <h3 className="font-semibold text-gray-700 mb-2">Análise de Conteúdo</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-sm">
                              <span className={classification.content_analysis.has_text ? 'text-green-600' : 'text-gray-400'}>
                                {classification.content_analysis.has_text ? '✓' : '✗'}
                              </span>
                              <span>Contém texto</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className={classification.content_analysis.has_tables ? 'text-green-600' : 'text-gray-400'}>
                                {classification.content_analysis.has_tables ? '✓' : '✗'}
                              </span>
                              <span>Contém tabelas</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="mx-auto mb-4 text-gray-300" size={48} />
                      <p>Faça upload de um documento para ver a análise</p>
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {activeTab === 'xml' && parsedData && 'xml_type' in parsedData && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Análise XML</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Informações Gerais</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Tipo XML</span>
                        <span className="text-blue-600 font-semibold">{parsedData.xml_type}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Tag Raiz</span>
                        <span className="text-gray-600">{parsedData.root_tag}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Elementos</span>
                        <span className="text-gray-600">{parsedData.elements_count}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Dados Extraídos</h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(parsedData.parsed_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pdf' && parsedData && 'parsed_data' in parsedData && 'pages_count' in parsedData.parsed_data && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Análise PDF</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Informações Gerais</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Páginas</span>
                        <span className="text-blue-600 font-semibold">{parsedData.parsed_data.pages_count}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Criptografado</span>
                        <span className={parsedData.parsed_data.is_encrypted ? 'text-red-600' : 'text-green-600'}>
                          {parsedData.parsed_data.is_encrypted ? 'Sim' : 'Não'}
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Tamanho</span>
                        <span className="text-gray-600">{parserService.formatFileSize('file_size' in parsedData ? parsedData.file_size : 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Texto Extraído</h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                      {parsedData.parsed_data.text_content?.map((page, index) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">Página {page.page}</h4>
                          <p className="text-sm text-gray-600">{page.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'spreadsheet' && parsedData && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Análise de Planilha</h2>
                
                {'sheets_count' in parsedData ? (
                  // Excel
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Planilhas</h3>
                        <p className="text-2xl font-bold text-blue-600">{parsedData.sheets_count}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Tipo</h3>
                        <p className="text-lg font-semibold text-green-600">{parsedData.file_type?.toUpperCase()}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Tamanho</h3>
                        <p className="text-lg font-semibold text-gray-600">{parserService.formatFileSize('file_size' in parsedData ? Number(parsedData.file_size) : 0)}</p>
                      </div>
                    </div>
                    
                    {parsedData.sheets_data && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Dados das Planilhas</h3>
                        <div className="space-y-4">
                          {Object.entries(parsedData.sheets_data).map(([sheetName, data]) => (
                            <div key={sheetName} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-medium text-gray-800 mb-2">{sheetName}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Linhas:</span>
                                  <span className="ml-2 font-medium">{data.rows_count}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Colunas:</span>
                                  <span className="ml-2 font-medium">{data.columns_count}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Colunas:</span>
                                  <span className="ml-2 font-medium">{data.columns.join(', ')}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // CSV
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Linhas</h3>
                        <p className="text-2xl font-bold text-blue-600">{'rows_count' in parsedData ? parsedData.rows_count : 0}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Colunas</h3>
                        <p className="text-2xl font-bold text-green-600">{'columns_count' in parsedData ? parsedData.columns_count : 0}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Delimitador</h3>
                        <p className="text-lg font-semibold text-orange-600">{'delimiter' in parsedData ? parsedData.delimiter : '-'}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Tamanho</h3>
                        <p className="text-lg font-semibold text-gray-600">{parserService.formatFileSize('file_size' in parsedData ? Number(parsedData.file_size) : 0)}</p>
                      </div>
                    </div>
                    
                    {'columns' in parsedData && parsedData.columns && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Colunas</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {parsedData.columns.map((column, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {column}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'formats' && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Formatos Suportados</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <motion.div 
                    className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Code className="text-blue-600" size={32} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">XML</h3>
                        <p className="text-sm text-gray-600">Documentos estruturados</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• NF-e, CTe, MDFe</p>
                      <p>• SPED Fiscal</p>
                      <p>• XMLs genéricos</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="p-6 border border-gray-200 rounded-xl hover:border-red-300 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="text-red-600" size={32} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">PDF</h3>
                        <p className="text-sm text-gray-600">Documentos portáteis</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Relatórios</p>
                      <p>• Contratos</p>
                      <p>• Documentos fiscais</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="p-6 border border-gray-200 rounded-xl hover:border-green-300 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <FileSpreadsheet className="text-green-600" size={32} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Excel</h3>
                        <p className="text-sm text-gray-600">Planilhas eletrônicas</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• .xlsx, .xls</p>
                      <p>• Múltiplas abas</p>
                      <p>• Dados estruturados</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="p-6 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <FileSpreadsheet className="text-orange-600" size={32} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">CSV</h3>
                        <p className="text-sm text-gray-600">Dados separados por vírgula</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Dados tabulares</p>
                      <p>• Exportações</p>
                      <p>• Relatórios simples</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="text-gray-600" size={32} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">TXT</h3>
                        <p className="text-sm text-gray-600">Arquivos de texto</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Logs</p>
                      <p>• Documentos simples</p>
                      <p>• Dados brutos</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 