# 🔐 Credenciais de Usuários - DL Sistema

**Data de Criação:** $(Get-Date -Format "dd/MM/yyyy HH:mm")  
**Ambiente:** Desenvolvimento Local  
**Backend:** http://localhost:8001

---

## 📋 Usuários Criados

### **👑 ADMIN (Superusuário)**
- **Email:** `admin@dl.com`
- **Senha:** `admin123`
- **Nome:** Administrador DL Sistema
- **Permissões:** Superusuário (acesso total)
- **Painel:** Todos os painéis

### **👨‍💼 GESTOR (Superusuário)**
- **Email:** `gestor@dl.com`
- **Senha:** `gestor123`
- **Nome:** Gestor DL Sistema
- **Permissões:** Superusuário (acesso total)
- **Painel:** /gestor

### **👨‍💼 VENDEDOR**
- **Email:** `vendedor@dl.com`
- **Senha:** `vendedor123`
- **Nome:** Vendedor DL Sistema
- **Permissões:** Usuário normal
- **Painel:** /vendedor

### **📢 ANÚNCIOS**
- **Email:** `anuncios@dl.com`
- **Senha:** `anuncios123`
- **Nome:** Anúncios DL Sistema
- **Permissões:** Usuário normal
- **Painel:** /anuncios

### **🧪 TESTE**
- **Email:** `teste@dl.com`
- **Senha:** `teste123`
- **Nome:** Usuário de Teste
- **Permissões:** Usuário normal
- **Painel:** Todos (para testes)

---

## 🎯 Painéis Disponíveis

### **Painel do Gestor**
- **URL:** http://localhost:3001/gestor
- **Acesso:** admin@dl.com, gestor@dl.com
- **Funcionalidades:** Dashboard, métricas, gestão geral

### **Painel do Vendedor**
- **URL:** http://localhost:3001/vendedor
- **Acesso:** vendedor@dl.com, admin@dl.com, gestor@dl.com
- **Funcionalidades:** Vendas, clientes, histórico

### **Painel de Anúncios**
- **URL:** http://localhost:3001/anuncios
- **Acesso:** anuncios@dl.com, admin@dl.com, gestor@dl.com
- **Funcionalidades:** Criação, gestão e publicação de anúncios

---

## 🚀 Como Acessar

### **1. Via Frontend (Recomendado)**
1. Acesse: http://localhost:3001/login
2. Use uma das credenciais acima
3. Será redirecionado para o painel apropriado

### **2. Via API (Para Desenvolvimento)**
```bash
# Login via API
curl -X POST "http://localhost:8001/api/v1/login/access-token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@dl.com&password=admin123"
```

### **3. Para Testes E2E**
Use as credenciais no arquivo `.env.local` do frontend:
```env
E2E_USER=admin@dl.com
E2E_PASS=admin123
```

---

## 🔧 Gerenciamento de Usuários

### **Criar Novo Usuário via API**
```bash
# Requer autenticação de superusuário
curl -X POST "http://localhost:8001/api/v1/users/" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@dl.com",
    "password": "senha123",
    "full_name": "Novo Usuário",
    "is_superuser": false
  }'
```

### **Listar Usuários**
```bash
curl -X GET "http://localhost:8001/api/v1/users/" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### **Executar Script de Criação**
```bash
cd dl-backend
python scripts/create_users.py
```

---

## ⚠️ Notas Importantes

### **Segurança**
- **⚠️ ATENÇÃO:** Estas são credenciais de desenvolvimento
- **NUNCA** use estas senhas em produção
- **SEMPRE** altere as senhas em ambiente de produção

### **Banco de Dados**
- **Arquivo:** `dl-backend/app.db` (SQLite)
- **Backup:** Faça backup regular do arquivo
- **Reset:** Para resetar, delete o arquivo `app.db`

### **Ambiente de Produção**
- Use senhas fortes e únicas
- Configure autenticação de dois fatores
- Implemente políticas de senha
- Use HTTPS sempre

---

## 📞 Suporte

### **Problemas Comuns**
1. **Usuário não consegue fazer login**
   - Verifique se o backend está rodando
   - Confirme as credenciais
   - Verifique se o banco existe

2. **Erro de permissão**
   - Verifique se o usuário tem `is_superuser=True`
   - Confirme as rotas de acesso

3. **Token expirado**
   - Faça login novamente
   - Verifique `ACCESS_TOKEN_EXPIRE_MINUTES` no `.env`

### **Logs**
- **Backend:** Verifique os logs do uvicorn
- **Frontend:** Verifique o console do navegador
- **Banco:** Use SQLite Browser para inspecionar

---

**Última Atualização:** $(Get-Date -Format "dd/MM/yyyy HH:mm")  
**Responsável:** Equipe de Desenvolvimento 