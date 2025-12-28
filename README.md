# mark85-cypress-api

Projeto de testes de API com Cypress (Mark85 course) — testes de endpoints REST integrados com MongoDB e RabbitMQ.

---

## ✅ Visão geral
Este repositório contém uma suíte de testes de API escrita com Cypress + cypress-plugin-api. Ele também integra geração de relatórios com Allure (`@shelex/cypress-allure-plugin`).

Principais tecnologias:
- Cypress (15.x)
- Node.js
- MongoDB (usado pelo backend sob teste)
- RabbitMQ (CloudAMQP usado nos testes de fila)
- Allure para relatórios

---

## 🚀 Pré-requisitos
- Node.js (recomendado 18+)
- npm
- A aplicação backend (API) rodando localmente em `BASE_URL` (por padrão `http://localhost:3333`)

---

## 🔧 Variáveis de ambiente
Crie um arquivo `.env` na raiz (não comitar segredos) com as chaves abaixo:

```
BASE_URL=http://localhost:3333
MONGO_URI=your_mongo_connection_string
AMQP_HOST=https://<your-cloudamqp>/api/queues/<vhost>
AMQP_QUEUE=tasks
AMQP_TOKEN=Basic <your_base64_token>
```

Observações:
- Evite envolver `AMQP_TOKEN` com aspas no `.env` (o parse pode incluir as aspas no valor).
- Se necessário, ajuste `cypress.config.js` para sobrescrever valores de `env`.

---

## 📦 Instalação

1. Instale dependências:

```bash
npm install
```

2. Configure o `.env` com valores adequados.

---

## 🧪 Scripts úteis
Execute os comandos abaixo na raiz do projeto.

- Executar todos os testes (headless):

```bash
npm run test
# que roda: npx cypress run
```

- Executar um spec específico (exemplo):

```bash
npx cypress run --spec "cypress/e2e/tasks/post.cy.js"
```

- Abrir interface do Cypress (modo interativo):

```bash
npx cypress open
```

---

## 📣 Allure (relatórios)
Fluxo recomendado para gerar/visualizar relatórios Allure:

1. Limpar resultados antigos (opcional):

```bash
rm -rf allure-results/*
```

2. Rodar os testes para gerar novos resultados Allure:

```bash
npx cypress run
```

3. Servir o relatório gerado:

```bash
npx allure serve
```

Dica: você pode adicionar scripts npm (ex.: `allure:clean`, `allure:run`, `allure:serve`) no `package.json` para facilitar.

---

## 🐞 Observações e notas de estabilidade
- Alguns testes interagem com uma fila (RabbitMQ). Para reduzir flaky tests, o projeto implementa retries ao ler a fila (`getMessageQueue`) e validações defensivas no `after` hooks para não falhar caso a mensagem ainda não tenha chegado.
- Se ocorrerem entradas "Broken" no Allure com mensagens de "error preparing this test file" (ex.: `cypress/support/e2e.js`), geralmente é causado por um import com caminho incorreto ou por resultados antigos em `allure-results`. Limpar `allure-results` e re-executar os testes normalmente resolve.

---

## Contribuição
- Abra uma issue descrevendo o problema ou um PR com a correção.
- Mantenha testes verdes e atualize o README quando necessário.

---

## Autor
- Projeto baseado no curso Mark85 — atualizado por você.

---

Se quiser, eu posso:
- (A) Adicionar scripts npm no `package.json` para `allure:clean`, `allure:run` e `allure:serve` e abri um PR; ou
- (B) Gerar um CHANGELOG com as correções que apliquei aqui.

Diga qual opção prefere e eu executo. 😄