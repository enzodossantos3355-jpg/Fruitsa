# FruitStudio — Guia de Configuração Firebase e Hospedagem no Render

## 1. Conexão com o Firebase Web (Sem variáveis obrigatórias no Render)

A inicialização única do Firebase Web está centralizada em `src/lib/firebase.ts`, consumindo a configuração pública de `firebase-applet-config.json`.

- **Firebase Authentication** e **Cloud Firestore** compartilham uma única instância do `FirebaseApp`.
- **Nenhuma credencial administrativa, chave privada ou conta de serviço** é utilizada no frontend.
- Não é necessário cadastrar variáveis de ambiente do Firebase no Render para que o Static Site funcione.
- Caso deseje apontar o projeto para outro app Firebase Web no futuro, basta substituir os campos públicos (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` e, se aplicável, `firestoreDatabaseId`) em `firebase-applet-config.json` (ou diretamente no objeto `firebaseConfig` em `src/lib/firebase.ts`).

## 2. Configurações necessárias no Firebase Console

1. **Habilitar E-mail e Senha (Authentication > Sign-in method):**
   - O login com **Google** já é provisionado automaticamente.
   - Para utilizar o cadastro e login com **E-mail e senha** e a **recuperação de senha**, abra o [Firebase Console](https://console.firebase.google.com/), acesse **Authentication > Sign-in method**, clique em **E-mail/senha** e ative a primeira opção (**E-mail/senha**).

2. **Adicionar Domínios Autorizados (Authentication > Settings > Authorized domains):**
   - Após publicar no Render, copie o domínio do seu Static Site (por exemplo: `fruitstudio.onrender.com` ou seu domínio personalizado).
   - No Firebase Console, acesse **Authentication > Settings > Authorized domains**, clique em **Add domain** e adicione o domínio do Render.
   - Sem este passo, o login com Google retornará `auth/unauthorized-domain` no ambiente publicado.

3. **Regras de Segurança do Cloud Firestore (`firestore.rules`):**
   - As regras em `firestore.rules` aplicam isolamento estrito por `UID`, validação completa de schema e tamanhos, bloqueio de leitura cruzada de PII e exigência de e-mail verificado nas escritas.
   - Recomenda-se revisar periodicamente as regras antes de compartilhar o aplicativo amplamente.

## 3. Hospedagem no Render como Static Site

O repositório inclui `render.yaml` e `public/_redirects` configurados para roteamento SPA.

- **Service Type:** Static Site
- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `dist`
- **Redirect / Rewrite Rule (SPA fallback):**
  - Source: `/*`
  - Destination: `/index.html`
  - Action: `Rewrite`
- **Environment Variables:** Nenhuma variável de ambiente do Firebase é obrigatória.
