export const generateTimestamp = () => {
  return new Date().getTime().toString();
};

export const generateProductData = (suffix?: string) => {
  const timestamp = generateTimestamp();
  const uniqueSuffix = suffix || timestamp;
  
  return {
    sku: `TEST-${uniqueSuffix}`,
    nome: `Produto Teste ${uniqueSuffix}`,
    categoria: "Autopeças",
    marca: "Teste",
    modelo_veiculo: "Genérico",
    ano_veiculo: "2020-2024",
    preco: 99.99,
    quantidade: 10,
    status: "ativo",
    origem: "manual",
    descricao: `Descrição do produto teste ${uniqueSuffix}`,
  };
};

export const generateUpdatedProductData = (suffix?: string) => {
  const timestamp = generateTimestamp();
  const uniqueSuffix = suffix || timestamp;
  
  return {
    nome: `Produto Atualizado ${uniqueSuffix}`,
    preco: 149.99,
    quantidade: 15,
    descricao: `Descrição atualizada do produto ${uniqueSuffix}`,
  };
};

export const testCredentials = {
  email: "admin@dl.com",
  senha: "admin123"
}; 