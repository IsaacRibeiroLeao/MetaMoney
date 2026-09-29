# MetaMoney

## Descrição
MetaMoney é um projeto desenvolvido principalmente em TypeScript, estruturado com uma aplicação frontend baseada em React (contendo rastreamento de produtos, gerenciamento de cardápio, formulários de categorias, pratos, produtos, vendas e tela de sorteio). O projeto encontra-se em produção (com deploy no ar).

## Funcionalidades
Com base na estrutura de componentes do frontend, o sistema oferece recursos para:
- Rastreamento e gerenciamento de produtos (`ProductTracker`, `ProductForm`, `ProductList`)
- Gerenciamento de cardápio (`CardapioManager`)
- Formulários para categorias e pratos (`CategoriaForm`, `PratoForm`)
- Gerenciamento de vendas (`VendaTracker`, `VendaForm`, `VendaList`)
- Cálculo e exibição de diferenças totais (`TotalDifference`)
- Tela de sorteio (`RaffleScreen`)

## Tecnologias
- **Linguagem Principal:** TypeScript
- **Frontend:** React (evidenciado por arquivos como `App.tsx`, `index.tsx`, `react-app-env.d.ts` e estrutura de componentes)
- **Gerenciamento de Pacotes:** npm (`package-lock.json`)

## Instalação
Para configurar o projeto localmente, siga os passos abaixo:

1. Clone o repositório.
2. Navegue até o diretório do frontend:
   ```bash
   cd product-price-tracker/frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

## Uso
Para iniciar a aplicação em ambiente de desenvolvimento:

```bash
npm start
```

Para executar os testes disponíveis:

```bash
npm test
```

## Licença
Este repositório não possui uma licença identificada.
