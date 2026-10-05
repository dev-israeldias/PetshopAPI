# PetCare API — Agendamento de Serviços para Petshop

## 1. Situação-problema

Petshops de pequeno porte costumam controlar agendamentos de banho, tosa e
consultas em papel ou em uma planilha compartilhada. Isso causa:

- Conflitos de horário (dois clientes marcados no mesmo horário);
- Perda de histórico de atendimentos;
- Dados de clientes (e-mail, telefone, senha de acesso) guardados sem nenhuma
  proteção.

## 2. Solução proposta

Uma API REST em **Node.js/Express** onde cada cliente se cadastra, faz login
e só enxerga os próprios agendamentos, com senha protegida por hash e acesso
às rotas sensíveis controlado por token JWT.

## 3. Como os 4 requisitos da disciplina foram atendidos

| Requisito | Onde está no código |
|---|---|
| **Model + Sequelize + MySQL** | `models/Cliente.js` e `models/Agendamento.js`, conectados via `config/database.js` (dialect `mysql`) |
| **JWT em rota protegida** | `middleware/verifyToken.js`, aplicado em todas as rotas de `routes/agendamentoRoutes.js` |
| **express-validator** | `body(...)` em `routes/authRoutes.js` e `routes/agendamentoRoutes.js`, checado com `validationResult` nos controllers |
| **bcrypt** | `authController.js`: `bcrypt.hash` no cadastro e `bcrypt.compare` no login |

## 4. Como rodar

```bash
npm install
cp .env.example .env   # preencha com os dados do seu MySQL
npm start
```

Endpoints principais:

- `POST /auth/registrar` — nome, email, senha, telefone
- `POST /auth/login` — email, senha → devolve `token`
- `POST /agendamentos` — (precisa do header `Authorization: Bearer <token>`)
- `GET /agendamentos` — lista os agendamentos do cliente logado

## 5. Estrutura sugerida para a apresentação (30/09/2026)

1. **Situação-problema** (1 slide) — o cenário do petshop sem sistema.
2. **Arquitetura da solução** (1 slide) — diagrama simples: cliente → rotas →
   middleware JWT → controller → model Sequelize → MySQL.
3. **Demonstração ao vivo** — cadastro, login, tentativa de acessar
   `/agendamentos` sem token (mostrar erro 401) e depois com token.
4. **Trechos de código-chave** — `verifyToken.js`, o `bcrypt.hash`/`compare`,
   e uma validação do `express-validator`.
5. **Conclusão** — o que o grupo aprenderia a evoluir (ex: cancelamento de
   agendamento, papéis de admin, notificações).

