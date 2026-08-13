# Prompt de Execução — Integração Web × Backend BabyBuddy

> Este documento é o prompt de execução passo a passo para conectar as telas já existentes do `Web_Babybuddy` às rotas reais do backend (`http://localhost:8080`, ver `Backend_Babybuddy/docs/api-rotas.md`). Cada Sprint abaixo deve ser executada e entregue de forma independente, na ordem apresentada, e só é considerada concluída quando o checklist de "não fazer" e os testes da sprint estiverem 100% verdes.

## Regras não negociáveis (valem para TODAS as sprints, sem exceção)

1. **Não alterar layout.** Estrutura visual, hierarquia de elementos e comportamento de UI das telas existentes permanecem exatamente como estão.
2. **Não alterar CSS.** Nenhum arquivo `.css` / `.module.css` é tocado em nenhuma sprint.
3. **Não alterar o que já funciona.** Nenhuma funcionalidade hoje operante pode regredir. Se algo hoje funciona só com dado mockado/localStorage e a sprint não cobre a substituição dele, deixe como está.
4. **Alteração é sempre aditiva.** Só se pluga a chamada de API dentro da lógica que já existe (handlers, `useEffect`, states) — sem reescrever componentes, sem introduzir libs de UI novas.
5. **Clean Code + DDD.** Nomes claros, funções pequenas e coesas, zero duplicação. Separar `domain` / `application` / `infrastructure` da camada de apresentação (`pages`/`components`, que ficam intocados visualmente).
6. **Nenhum dado sensível em `localStorage`** (senha, hash, token bruto).
7. **Toda função nova em `application/` e `infrastructure/` tem teste unitário. Todo fluxo de tela plugado tem cenário E2E.**

## Stack de testes (a ser adicionada — o projeto hoje não tem nenhuma)

- **Unitário/integração:** `vitest` + `@testing-library/react` + `@testing-library/jest-dom` — nativo ao ecossistema Vite, sem config paralela de bundler.
- **E2E:** `@playwright/test` — roda contra `npm run dev` + backend real em `localhost:8080`, cobre os fluxos ponta a ponta (login, cadastro, questionário, perfil, admin).
- Scripts novos em `package.json`: `test` (vitest), `test:e2e` (playwright). Nenhum script existente (`dev`, `build`, `preview`, `lint`) é alterado.

## Arquitetura alvo (DDD-lite, 100% aditiva)

```
src/
  domain/            # entidades/tipos por contexto: Usuario, Gestante, Questionario, Material...
  application/        # casos de uso: autenticarUsuario, cadastrarUsuario, registrarQuestionario, listarMateriais...
  infrastructure/
    http/apiClient.js       # instância axios única (baseURL = VITE_API_URL, withCredentials)
    repositories/            # UsuarioRepository, MaterialRepository, GestanteRepository, QuestionarioRepository...
  pages/ ...          # EXISTENTE, INTOCADO visualmente — handlers passam a chamar application/*
  components/ ...     # EXISTENTE, INTOCADO visualmente
```

---

## Sprint 0 — Fundação técnica (nenhuma tela tocada)

**Objetivo:** preparar API client, autenticação e infraestrutura de testes para que as sprints seguintes só precisem plugar handlers.

**Execute:**
1. Configurar `vitest` + RTL + `playwright` (dependências, configs, scripts).
2. Criar `src/infrastructure/http/apiClient.js` (axios, `baseURL` via `VITE_API_URL`, `withCredentials: true`).
3. Criar `.env.example` com `VITE_API_URL=http://localhost:8080`.
4. Criar `AuthContext` em `application/` (`login`, `logout`, `usuarioAtual`, `isAdmin`) — **ainda sem plugar em nenhuma tela**.
5. Criar repositórios crus mapeando `api-rotas.md`: `UsuarioRepository`, `MaterialRepository`, `GestanteRepository`, `QuestionarioRepository`.

**Testes desta sprint:**
- Unitários: `apiClient` (baseURL/headers), cada repository (axios mockado), transições de estado do `AuthContext`.
- E2E: nenhum ainda.

**Definição de pronto:** suíte unitária 100% verde; `git diff` não toca em nenhum arquivo de `src/pages`, `src/components` ou `*.css`.

---

## Sprint 1 — Autenticação (Login, Cadastro, ProtectedRoute)

**Objetivo:** plugar as 3 telas de autenticação nos serviços da Sprint 0.

**Execute:**
1. `Login.jsx`: handler de submit passa a chamar `application/autenticarUsuario` (`POST /login` + `GET /api/usuarios/me`). Remover do código-fonte as credenciais de admin hardcoded — é lógica, não layout.
2. `Cadastro.jsx`: handler passa a usar `application/cadastrarUsuario` (`POST /api/usuarios`, `nivelAcesso: "Gestante"`); parar de persistir senha em `localStorage`. Apagar o arquivo de rascunho morto `src/pages/Cadastro/anotações`.
3. `ProtectedRoute.jsx`: validação via `AuthContext` (`usuarioAtual`/`isAdmin`) em vez de ler `localStorage` cru.

**Testes desta sprint:**
- Unitários: `autenticarUsuario`, `cadastrarUsuario`, render condicional do `ProtectedRoute`.
- E2E: cadastro → login → acesso a rota protegida → bloqueio de rota admin-only para usuário comum → logout.

**Definição de pronto:** login/cadastro reais contra o backend em `localhost:8080`; diff de CSS vazio.

---

## Sprint 2 — Questionário → Gestante

**Objetivo:** persistir o questionário de verdade, criando o `Gestante` antes.

**Execute:**
1. `application/registrarGestante` (`POST /api/gestantes`, vinculado ao usuário logado).
2. `application/registrarQuestionario` (`POST /api/questionarios`) com mapeamento dos campos do formulário para o contrato do backend — o mapeamento fica dentro de `salvarQuestionario()`, sem alterar perguntas/wizard visual.
3. Campos do form sem correspondência no backend (`jaTeveParto`, `cicloRegular`, `autorizaUsoDados`) permanecem apenas locais/não enviados.

**Testes desta sprint:**
- Unitários: mapeamento de payload, `registrarGestante`, `registrarQuestionario` (sucesso e erro).
- E2E: completar o wizard do início ao fim e validar via `GET /api/questionarios/gestante/{id}`.

**Definição de pronto:** dados reais no backend ao final do fluxo; UI do wizard inalterada.

> **Bloqueio conhecido:** criação de `Gestação` (`POST /api/gestacoes`) fica **fora** desta sprint — bug documentado em `Backend_Babybuddy/docs/plano-alteracao-schema-2026-08-13.md` (coluna `esta_na_sua_primeira_gestacao` não mapeada). Retomar apenas quando o backend confirmar a correção.

---

## Sprint 3 — Perfil

**Objetivo:** substituir `localStorage` pelos dados reais do usuário logado.

**Execute:**
1. `GET /api/usuarios/me` ao montar a tela (troca a fonte do dado, mantendo os mesmos elementos visuais).
2. Salvar edição → `PUT /api/usuarios/{id}`.
3. Troca de senha → `PATCH /api/usuarios/{id}/senha` (fluxo de confirmação na UI já existe, só falta plugar).
4. Remover exibição de senha em texto puro (o botão "olho" pode continuar existindo, sem revelar segredo real — alinhar com o time se ele deve sumir ou virar placeholder).
5. Logout → `POST /logout` + limpar `AuthContext`.
6. Lista de artigos → `GET /api/materiais` (pública) no lugar do `localStorage`.

**Testes desta sprint:**
- Unitários: serviços de perfil (get/update/senha), mapeamento de materiais.
- E2E: editar perfil e confirmar persistência após reload; trocar senha e logar novamente com a senha nova; listar artigos vindos da API.

**Definição de pronto:** zero leitura/escrita de `localStorage` para dados de usuário; UI idêntica.

---

## Sprint 4 — Administrador

**Objetivo:** CRUD de Materiais real + correção da chamada de usuários.

**Execute:**
1. Corrigir `GET /api/usuarios` para usar o `apiClient` autenticado da Sprint 0 (hoje é `fetch` cru, sem credenciais, sempre falha).
2. Trocar o CRUD local de "artigos" por `MaterialRepository`: `GET` listar, `POST` criar, `PUT` atualizar, `PATCH .../ativar` e `.../inativar`, `DELETE` remover — reaproveitando os mesmos botões/modal já existentes, só trocando o que cada handler faz por dentro.
3. Resolver a divergência do campo `imagem` (local, base64) vs. o schema real (`arquivo`/`link`) sem quebrar o upload já existente na tela.
4. Implementar a aba "Usuários" (hoje vazia no menu) com listagem via `GET /api/usuarios` e ações de inativar/excluir, reaproveitando o mesmo padrão visual de card/tabela usado em artigos.

**Testes desta sprint:**
- Unitários: `MaterialRepository`, `UsuarioRepository` (list/inativar/delete).
- E2E: criar/editar/inativar/excluir material como admin e conferir refletido em `GET /api/materiais`; listar/inativar usuário.

**Definição de pronto:** zero persistência de artigos em `localStorage`; layout do dashboard inalterado.

---

## Backlog (fora do escopo — telas ainda não existem)

`Agenda`, `Evento`, `Gestação` (bloqueada pelo bug do backend), `Histórico de Gestação`, `Favoritos`, `Suporte` — exigem telas novas, não apenas conexão. Planejar como sprints separadas quando priorizadas; não fazem parte deste prompt.

## Checklist de "não fazer" (repetir antes de cada PR/entrega de sprint)

- [ ] Nenhum arquivo `.css`/`.module.css` foi alterado.
- [ ] Nenhuma estrutura JSX visual foi alterada (só lógica/dados dentro dos handlers).
- [ ] Nenhuma funcionalidade que já funcionava parou de funcionar (validar manualmente os fluxos antigos).
- [ ] Testes unitários + E2E da sprint passando.
- [ ] Nenhuma dependência nova além do estritamente necessário (`axios` já existe no projeto; `vitest`, `@testing-library/react`, `@playwright/test` são as únicas adições, e só na Sprint 0).
