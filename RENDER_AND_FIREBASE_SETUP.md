# FruitStudio — Guia de Publicação no Render (Static Site) e Firebase

## 1. Visão Geral da Publicação

O FruitStudio foi preparado como **Static Site** (SPA em React + Vite), sem servidores Express ou Node.js em produção e sem dependências de APIs pagas.

- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `dist`
- **Arquivo de lock:** `package-lock.json` sincronizado com `package.json`
- **Node.js recomendado:** `>= 20.19.0` (definido em `package.json`)
- **Roteamento SPA:** regra de rewrite de `/*` para `/index.html` configurada em `render.yaml` e `public/_redirects`
- **Headers de produção:** `Cross-Origin-Opener-Policy: same-origin-allow-popups` incluído em `render.yaml` para compatibilidade total do popup de login com Google

## 2. Configuração Pública do Firebase Web

A inicialização única do Firebase Authentication e do Cloud Firestore está centralizada em `src/lib/firebase.ts` (lendo os dados públicos de `firebase-applet-config.json`).

- **Não é necessário cadastrar variáveis de ambiente do Firebase no Render.**
- Nenhuma credencial administrativa, chave privada ou conta de serviço existe no frontend.
- O arquivo `firebase-applet-config.json` não está no `.gitignore`, garantindo que o build remoto no Render encontre a configuração pública automaticamente.

## 3. Passos para Publicar no Render

1. Envie o repositório atualizado (incluindo `package-lock.json`, `render.yaml`, `public/_redirects` e `firebase-applet-config.json`) para o GitHub/GitLab.
2. No painel do Render, escolha **New + → Blueprint** (para usar `render.yaml` automaticamente) ou **New + → Static Site** com:
   - **Build Command:** `npm ci && npm run build`
   - **Publish Directory:** `dist`
   - **Redirects/Rewrites:** Source `/*` → Destination `/index.html` → Action `Rewrite`
3. Nenhuma variável de ambiente obrigatória precisa ser adicionada.

## 4. Configurações Externas Pendentes no Firebase Console

Para que a autenticação com **Google** e **E-mail/senha** funcione em produção no endereço publicado do Render, verifique no [Firebase Console](https://console.firebase.google.com/) (projeto `gen-lang-client-0129726286`):

1. **Domínios autorizados (obrigatório para produção):**
   - Acesse **Authentication → Settings → Authorized domains**.
   - Clique em **Add domain** e adicione o domínio gerado pelo Render (ex.: `fruitstudio.onrender.com`) e qualquer domínio personalizado que venha a utilizar.
   - Sem esse passo, o login com Google retornará `auth/unauthorized-domain`.
2. **Provedor E-mail e senha (obrigatório para cadastro/login com e-mail):**
   - Acesse **Authentication → Sign-in method**.
   - Ative o provedor **E-mail/senha** (a primeira opção; não é necessário ativar link sem senha).
3. **Regras do Cloud Firestore (`firestore.rules`):**
   - As regras já estão publicadas com isolamento por UID, verificação de e-mail e validação estrita de schema. Recomenda-se revisá-las periodicamente antes de ampliar o acesso público.
