# Casa de Bolos — Plataforma de Atendimento & Pedidos Online (V1)

Sistema profissional de cardápio digital, atendimento ao cliente e gestão de pedidos para confeitaria artesanal.

Desenvolvido em **Python 3 / Flask**, com frontend **HTML5 / CSS3 / JavaScript Vanilla / Jinja2**, e banco de dados relacional **SQLite3**.

---

## 🎂 Funcionalidades da V1

### Fluxo do Cliente (Mobile First)
1. **Identificação Inteligente por Telefone**:
   - Se já for cliente: recupera o nome ("*Olá, João! Que bom ter você de volta.*") e endereço padrão.
   - Se for primeiro acesso: cadastro rápido com nome e telefone.
2. **Cardápio Digital**:
   - Categorias com navegação por abas horizontais no celular.
   - Cards limpos com fotos de alta qualidade, preços destacados e descrições.
3. **Página / Modal do Produto**:
   - Foto ampliada, controles de quantidade `[-] [+]` e campo para observações.
4. **Carrinho & Checkout**:
   - Ajuste em tempo real de itens e remoção.
   - Escolha entre **Retirada no balcão** (grátis) ou **Entrega em domicílio** (com taxa configurável e validação de endereço).
5. **Resumo e Confirmação**:
   - Resumo completo antes da confirmação final.
   - Geração de pedido com ID sequencial (Ex: `#1042`).
   - Botão para compartilhamento do comprovante direto no **WhatsApp**.

### Painel Administrativo (`/admin`)
- **Dashboard Operacional**: Faturamento do dia, pedidos do dia, pedidos na cozinha/em preparo e aguardando confirmação.
- **Gestão de Pedidos**: Fluxo completo de status adaptado para Entrega ou Retirada.
  - *Entrega*: `NOVO` → `CONFIRMADO` → `EM PREPARO` → `PRONTO` → `SAIU PARA ENTREGA` → `ENTREGUE`
  - *Retirada*: `NOVO` → `CONFIRMADO` → `EM PREPARO` → `PRONTO PARA RETIRADA` → `RETIRADO`
- **CRUD de Produtos**: Criação, edição, preços, fotos, ativação/desativação (com proteção de histórico para não quebrar pedidos anteriores).
- **Categorias**: Organização de ordem e visibilidade no cardápio.
- **Clientes**: Histórico de consumo, total de pedidos e gastos por cliente.
- **Configurações**: Ajuste da taxa de entrega e endereço físico da confeitaria.

---

## 🚀 Como Executar Localmente

### 1. Requisitos
- Python 3.10+
- pip

### 2. Instalação das Dependências
```bash
cd casa_de_bolos
pip install -r requirements.txt
```

### 3. Inicialização
```bash
python app.py
```
O banco SQLite `database/casa_de_bolos.db` será criado e semeado automaticamente na primeira execução com categorias e produtos de demonstração.

Acesse no navegador:
- Loja / Cliente: `http://localhost:5000/`
- Painel Administrativo: `http://localhost:5000/admin`

---

## 🗄️ Estrutura do Banco SQLite3

- **`clientes`**: `id`, `nome`, `telefone` (UNIQUE), `endereco`, `numero`, `complemento`, `bairro`, `cidade`, `created_at`, `updated_at`.
- **`categorias`**: `id`, `nome`, `descricao`, `ativo`, `ordem`.
- **`produtos`**: `id`, `categoria_id`, `nome`, `descricao`, `preco`, `imagem`, `ativo`, `destaque`, `created_at`, `updated_at`.
- **`pedidos`**: `id`, `cliente_id`, `tipo_entrega`, `status`, `subtotal`, `taxa_entrega`, `total`, `observacao`, `endereco_entrega`, `created_at`, `updated_at`.
- **`pedido_itens`**: `id`, `pedido_id`, `produto_id`, `quantidade`, `preco_unitario`, `subtotal`.
- **`configuracoes`**: `chave`, `valor` (ex: `taxa_entrega`, `nome_loja`).

---

## 🔮 Preparado para a V2 (Escalabilidade)
- **Integração WhatsApp**: Estrutura pronta para webhook de envio de status.
- **Pagamento PIX / Mercado Pago**: Campos de transação prontos no modelo de pedidos.
- **Impressão Térmica**: Endpoint de payload pronto para impressoras não-fiscais (ESC/POS) de 58mm/80mm.
