# REQUIREMENTS / REQUISITOS

Este arquivo descreve os requisitos e dependências para rodar o projeto `mark85-cypress-api` localmente, incluindo ferramentas de sistema, dependências Node e instruções rápidas de instalação.

---

## 1) Requisitos de sistema (mínimos recomendados)
- Node.js: 18.x ou mais recente (verifique com `node -v`).
- npm: acompanha o Node.js (verifique com `npm -v`).
- Java 8+ (recomendado) — usado pelo Allure CLI em algumas plataformas (`java -version`).
- Espaço em disco e rede para baixar dependências.

> Sugestão: usar `nvm` para gerenciar versões do Node (`.nvmrc` pode ser adicionado para fixar a versão do projeto).

---

## 2) Dependências do projeto (dev)
Listadas em `package.json` (devDependencies):

- @shelex/cypress-allure-plugin ^2.41.2
- allure-commandline ^2.36.0
- cypress ^15.8.1
- cypress-plugin-api ^2.11.2
- dotenv ^17.2.3
- mongodb ^7.0.0

Instalação (na raiz do projeto):

```bash
npm install
```

Isso instala `node_modules/` e criará `package-lock.json` com versões travadas.

---

## 3) Variáveis de ambiente necessárias (.env)
Crie um arquivo `.env` com as chaves abaixo (não comite esse arquivo se conter segredos):

```
BASE_URL=http://localhost:3333
MONGO_URI=<sua_connection_string_mongo>
AMQP_HOST=https://<seu-cloudamqp>/api/queues/<vhost>
AMQP_QUEUE=tasks
AMQP_TOKEN=Basic <seu_token_base64>
```

Notas:
- Não inclua aspas em `AMQP_TOKEN` (pode incluir as aspas no valor).
- Ajuste `BASE_URL` se o backend estiver em outra porta/host.

---

## 4) Comandos úteis
- Executar todos os testes (headless):
  ```bash
  npm run test # ou npx cypress run
  ```

- Rodar um spec específico:
  ```bash
  npx cypress run --spec "cypress/e2e/tasks/post.cy.js"
  ```

- Abrir o runner interativo:
  ```bash
  npx cypress open
  ```

- Gerar e visualizar relatório Allure (fluxo):
  ```bash
  # limpar resultados antigos (opcional)
  rm -rf allure-results/*

  # rodar testes (gera arquivos em allure-results)
  npx cypress run

  # servir relatório
  npx allure serve
  ```

---

## 5) Serviços externos usados durante os testes
- MongoDB (aplicação sob teste deve apontar para um Mongo ativo): `MONGO_URI`.
- RabbitMQ (CloudAMQP) — usado para testar envio/leitura de mensagens: `AMQP_HOST`, `AMQP_QUEUE`, `AMQP_TOKEN`.

Sugestão: em ambiente de CI, execute containers via `docker-compose` (Mongo + RabbitMQ) ou aponte para instâncias de teste.

---

## 6) Debug e verificação
- Verifique versões:
  - `node -v`
  - `npm -v`
  - `java -version` (se necessário para Allure)
- Se o Allure mostrar testes “Broken” com erro em `cypress/support/e2e.js`, verifique imports desse arquivo e limpe `allure-results/` e gere novamente.

---

## 7) Dicas (opcional)
- Adicione `.env.example` com chaves em branco para facilitar o onboarding.
- Adicione scripts npm úteis em `package.json`:
  ```json
  "scripts": {
    "test": "npx cypress run",
    "allure:clean": "rm -rf allure-results/*",
    "allure:serve": "npx allure serve"
  }
  ```

---

Se quiser, eu posso:
- adicionar um `.env.example` automaticamente, ou
- adicionar os scripts npm sugeridos ao `package.json` e commitar as mudanças.

Diga qual dessas ações prefere que eu execute.