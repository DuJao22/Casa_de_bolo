# 🍰 Guia de Deploy no Render — Casa de Bolos

Este projeto foi 100% otimizado para deploy de alta performance no **[Render.com](https://render.com)**.

---

## ⚡ Opção 1: Deploy Automático via Blueprint (Recomendado)

O repositório já conta com o arquivo `render.yaml` pré-configurado.

1. Faça o **push** do seu código para o seu repositório no **GitHub** ou **GitLab**.
2. Acesse o [Render Dashboard](https://dashboard.render.com).
3. Clique em **New +** no canto superior direito e selecione **Blueprint**.
4. Conecte o repositório da `casa-de-bolos`.
5. O Render detectará automaticamente o arquivo `render.yaml` com todas as configurações:
   - **Nome:** `casa-de-bolos`
   - **Ambiente:** Node.js 22
   - **Plano:** Free (Gratuito)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
6. Clique em **Apply** e aguarde a conclusão do build e deploy!

---

## 🛠️ Opção 2: Deploy Manual como Web Service

Se preferir configurar o serviço manualmente pelo painel do Render:

1. No Dashboard do Render, clique em **New +** → **Web Service**.
2. Conecte seu repositório Git.
3. Preencha os campos exatamente assim:
   - **Name:** `casa-de-bolos`
   - **Region:** `Oregon (US West)` ou a mais próxima de seus clientes
   - **Branch:** `main` (ou sua branch principal)
   - **Root Directory:** *(deixe em branco / raiz)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. Na seção **Advanced**:
   - **Health Check Path:** `/api/health`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `NODE_VERSION`: `22`
5. Clique em **Create Web Service**.

---

## 🚀 Otimizações Implementadas para o Render

- ✅ **Node.js 22 nativo**: configurado via `.node-version`, `.nvmrc` e `render.yaml`, garantindo execução de TypeScript sem dependências pesadas de transpilador em produção.
- ✅ **Compressão Gzip/Deflate**: middleware `compression` integrado no servidor Express para reduzir o tráfego de rede e acelerar o carregamento para conexões móveis.
- ✅ **Cache de Alta Performance**:
  - `/assets/*` (arquivos com hash do Vite): cache de 1 ano (`max-age=31536000, immutable`).
  - `index.html` e SPA Fallback: cabeçalho `no-cache, no-store, must-revalidate` para garantir que novas versões e deploys apareçam instantaneamente para os clientes sem cache preso.
- ✅ **Endpoint de Healthcheck Robusto (`/api/health`)**:
  - Retorna `HTTP 200` com métricas em tempo real (`uptimeSeconds`, `memory`, `nodeVersion`).
  - Usado pelo Render para **Zero-Downtime Deploys** (o tráfego só é direcionado após o serviço responder saudável).
- ✅ **Encerramento Gracioso (Graceful Shutdown)**:
  - Captura os sinais `SIGTERM` e `SIGINT` enviados pelo Render durante atualizações de versão, finalizando conexões ativas sem desconectar clientes no meio de um pedido.
- ✅ **Code-Splitting no Vite**:
  - Divisão de pacotes terceiros (`vendor-react`, `vendor-icons`, `vendor-motion`), reduzindo o tamanho do bundle inicial e acelerando o carregamento inicial.

---

## 🔍 Testando Localmente a Versão de Produção

Para testar exatamente o mesmo fluxo que o Render executa:

```bash
# 1. Instalar dependências
npm install

# 2. Gerar o build otimizado
npm run build

# 3. Iniciar o servidor de produção
npm start
```

Acesse:
- **Aplicação:** [http://localhost:3000](http://localhost:3000)
- **Healthcheck:** [http://localhost:3000/api/health](http://localhost:3000/api/health)
