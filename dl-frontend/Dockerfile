# --- Estágio 1: Build ---
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Recebe a URL da API como um argumento de build
    ARG NEXT_PUBLIC_API_URL
    # Define a variável de ambiente para o processo de build
    ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    
    # Copia os arquivos de dependência e instala
    COPY package*.json ./
    RUN npm install
    
    # Copia todo o código-fonte
    COPY . .
    
    # Garante que qualquer build antigo seja removido
    RUN rm -rf .next
    
    # Constrói a aplicação com a configuração correta
    RUN npm run build
    
    # --- Estágio 2: Produção ---
    FROM node:20-alpine
    
    WORKDIR /app
    
    # Copia apenas os artefatos necessários do estágio de build
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    
    # Expõe a porta e define o comando para iniciar o servidor Next.js
    EXPOSE 3000
    CMD ["npm", "start"]