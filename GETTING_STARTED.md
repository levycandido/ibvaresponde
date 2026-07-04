# 🚀 Como Começar

## ✅ Status do Projeto

A aplicação está **100% funcional** e rodando em desenvolvimento!

**Servidor em:** `http://localhost:3000`

## 📱 Testando a Aplicação

### Login (Primeira Tela)
- Email: `teste@example.com` (ou qualquer email)
- Senha: `123456` (ou qualquer senha)
- **Nota:** Login local é apenas para teste. Produção usará AWS Cognito.

### Perfil Padrão
O usuário mockado tem o perfil **ADMIN**, então você terá acesso a:
- Criar pesquisas ✅
- Editar pesquisas ✅
- Publicar pesquisas ✅
- Visualizar relatórios ✅
- Ver respostas dos participantes ✅

## 🎯 Fluxo de Teste Recomendado

### 1️⃣ Explorar o Dashboard
```
Login → Dashboard
```
- Visualize estatísticas: pesquisas totais, ativas, respostas
- Veja pesquisas recentes
- Acesse ações rápidas

### 2️⃣ Responder uma Pesquisa
```
Dashboard → Pesquisas → Selecione uma pesquisa → Responder
```
- Teste os 3 tipos de perguntas:
  - **RADIO**: Clique em uma opção (exclui as outras)
  - **CHECKBOX**: Clique em múltiplas opções
  - **MEMO**: Digite uma resposta livre (até 1000 caracteres)
- Valide perguntas obrigatórias (marcadas com *)
- Veja o progresso da pesquisa
- Envie as respostas

### 3️⃣ Criar uma Nova Pesquisa (Admin)
```
Dashboard → Ações Rápidas → Nova Pesquisa
```
- Preencha título e descrição
- Defina datas de início e fim
- Clique em "Adicionar" para criar perguntas
- Para cada pergunta:
  - Digite título e descrição (opcional)
  - Escolha o tipo (RADIO, CHECKBOX ou MEMO)
  - Marque se é obrigatória
  - Se RADIO/CHECKBOX: adicione opções
- Clique em "Criar Pesquisa"

### 4️⃣ Visualizar Relatórios (Admin)
```
Dashboard → Relatórios (ou menu inferior)
```
- Veja estatísticas gerais em cards
- Explore gráficos:
  - **Pizza**: Status das pesquisas (Rascunho, Publicada, Encerrada)
  - **Barras**: Respostas por pesquisa
  - **Pie**: Tipos de perguntas usadas
- Selecione uma pesquisa para ver análise detalhada
- Visualize respostas abertas das perguntas do tipo MEMO

### 5️⃣ Gerenciar Perfil
```
Menu Inferior → Perfil
```
- Visualize dados do usuário (nome, email, ID)
- Veja suas permissões (ADMIN)
- Clique em "Sair da Conta" para fazer logout

## 📊 Dados de Teste Inclusos

### Pesquisas Mockadas
1. **Satisfação com o Serviço Religioso** (PUBLISHED)
   - 3 perguntas (RADIO, CHECKBOX, MEMO)
   - 2 respostas mockadas

2. **Interesse em Grupos de Estudo** (PUBLISHED)
   - 1 pergunta RADIO
   - 1 resposta mockada

3. **Pesquisa de Novas Iniciativas** (DRAFT)
   - 1 pergunta CHECKBOX
   - Não publicada

### Usuário Padrão
```
Nome: Claudio
Email: levyjavadffffev@gmail.com
ID: 5e444056-a581-4f3d-bbd3-9ab24cb4c093
Roles: ADMIN
Status: ACTIVE
```

## 🌐 Navegação Mobile (Menu Inferior)

| Ícone | Página | Função |
|-------|--------|--------|
| 🏠 | Início | Dashboard com estatísticas |
| 📄 | Pesquisas | Lista de pesquisas |
| 📊 | Relatórios | Gráficos e análises |
| 👤 | Perfil | Dados do usuário |

## 💻 Desenvolvendo

### Parar o Servidor
```powershell
Ctrl + C
```

### Reiniciar o Servidor
```powershell
npm run dev
```

### Compilar para Produção
```powershell
npm run build
npm start
```

### Verificar Erros TypeScript
```powershell
npx tsc --noEmit
```

## 🔍 Visualizar no Mobile Real

### iOS (via Safari)
1. Esteja na mesma rede Wi-Fi
2. Abra: `http://192.168.18.10:3000` (substitua IP)
3. Teste em modo retrato (375px de largura)

### Android (via Chrome)
1. Ative Developer Mode
2. Conecte via USB
3. Ou acesse: `http://[SEU-IP]:3000`
4. Teste em viewport 375x812

## 🎨 Testando Design Mobile

### Chrome DevTools
1. Abra DevTools (F12)
2. Clique em "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Selecione "iPhone SE" (375x667)
4. Teste interações de toque

## ⚠️ Avisos / Próximos Passos

### Avisos Atuais (Não são Erros)
- ⚠️ "Unsupported metadata viewport" - Avisos do Next.js (não afetam funcionamento)
- Esses podem ser removidos futuramente movendo viewport para export separado

### Para Produção
- [ ] Integrar AWS Cognito real
- [ ] Conectar com API Gateway + Lambda
- [ ] Configurar DynamoDB
- [ ] Remover dados mockados
- [ ] Adicionar testes automatizados
- [ ] Configurar CI/CD

## 🆘 Troubleshooting

### Porta 3000 em uso
```powershell
# Matar processo
taskkill /PID [PID] /F
# Ou reiniciar o terminal
```

### Cache do Next.js
```powershell
rm -r .next
npm run dev
```

### Dependências não atualizadas
```powershell
rm package-lock.json
npm install --legacy-peer-deps
npm run dev
```

## 📞 Suporte

- Veja **README.md** para documentação técnica completa
- Veja **CLAUDE.md** para guia de desenvolvimento
- Verifique estrutura em `/app` para entender fluxos

## ✨ Próximas Funcionalidades Sugeridas

1. **Autenticação Real**
   - Integrar AWS Cognito completamente
   - Persistir token em localStorage

2. **Backend Real**
   - Criar Lambda functions
   - Integrar com DynamoDB
   - Implementar validações no backend

3. **Melhorias UX**
   - Dark mode
   - Offline support (PWA)
   - Notificações push
   - Sincronização em tempo real

4. **Analytics**
   - Rastrear eventos de usuário
   - Métricas de resposta
   - Retenção de usuários

---

**Desenvolvido com ❤️ usando Next.js, React e TypeScript**

© 2026 Igreja Batista Vida Abundante
