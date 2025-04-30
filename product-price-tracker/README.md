# Rastreador de Preços e Vendas (MetaMoney)

Uma aplicação React com backend FastAPI que permite aos usuários rastrear preços de produtos e vendas, salvá-los em arquivos CSV e bloquear valores finais.

## Estrutura do Projeto

- `frontend/`: Aplicação React construída com TypeScript e Bootstrap
- `backend/`: Backend FastAPI que gerencia operações com arquivos CSV

## Configuração e Instalação

### Configuração do Backend

1. Navegue até o diretório do backend:
   ```
   cd backend
   ```

2. Crie um ambiente virtual (opcional, mas recomendado):
   ```
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

3. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```

4. Execute o servidor FastAPI:
   ```
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Configuração do Frontend

1. Navegue até o diretório do frontend:
   ```
   cd frontend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```
   npm start
   ```

4. Ou execute ambos (frontend e backend) simultaneamente:
   ```
   npm run dev
   ```

## Uso

1. Inicie os servidores backend e frontend.
2. Abra seu navegador e acesse `http://localhost:3000`.
3. Use as abas para alternar entre gerenciamento de Produtos e Vendas.
4. Adicione novos produtos ou vendas usando os formulários.
5. Os dados serão automaticamente salvos em arquivos CSV no backend.
6. Você pode editar produtos e vendas conforme necessário.
7. Bloqueie os valores finais quando estiver satisfeito.
8. Veja o resumo financeiro que mostra a diferença entre produtos e vendas.

## Funcionalidades

- Rastreamento de produtos e vendas em tempo real
- Geração e gerenciamento de arquivos CSV
- Capacidade de bloquear valores finais
- Interface moderna e responsiva com Bootstrap
- Resumo financeiro com cálculo de lucro/prejuízo
- Aplicação full-stack com React e FastAPI
- Layout otimizado para dispositivos móveis

## Endpoints da API

- `GET /products`: Recuperar todos os produtos
- `POST /products`: Adicionar um novo produto
- `PUT /products/{product_id}`: Atualizar um produto
- `PUT /lock-final-value`: Bloquear o valor final dos produtos
- `GET /vendas`: Recuperar todas as vendas
- `POST /vendas`: Adicionar uma nova venda
- `PUT /vendas/{venda_id}`: Atualizar uma venda
- `PUT /lock-vendas-final-value`: Bloquear o valor final das vendas
