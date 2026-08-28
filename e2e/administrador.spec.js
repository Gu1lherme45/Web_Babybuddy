import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8080';
const ADMIN_AUTH = `Basic ${Buffer.from('admin@babybuddy.com.br:Admin@123').toString('base64')}`;

async function loginComoAdmin(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@babybuddy.com.br');
  await page.fill('input[name="senha"]', 'Admin@123');
  await page.click('button[type=submit]');
  await page.waitForURL('**/administrador', { timeout: 10000 });
}

// os dois testes abaixo escrevem na mesma tabela `Material` do backend real;
// rodar em série evita que um interfira na contagem/estado do outro
test.describe.configure({ mode: 'serial' });

test('criar artigo grava um Material via POST /api/materiais', async ({ page, request }) => {
  await loginComoAdmin(page);

  // conta só pelo título "Novo artigo" — evita corrida com o outro teste
  // deste arquivo, que roda em paralelo e também cria/edita materiais
  const antes = (await (await request.get(`${API_URL}/api/materiais`)).json()).filter(
    (m) => m.titulo === 'Novo artigo'
  ).length;

  await page.getByRole('button', { name: /novo artigo/i }).click();
  await expect(page.getByText('Novo artigo').first()).toBeVisible();

  const depois = (await (await request.get(`${API_URL}/api/materiais`)).json()).filter(
    (m) => m.titulo === 'Novo artigo'
  ).length;
  expect(depois).toBe(antes + 1);
});

test('editar e suspender um artigo persiste via PUT e PATCH /api/materiais', async ({
  page,
  request,
}) => {
  await loginComoAdmin(page);

  // títulos únicos por execução — evita colidir com dados deixados por
  // rodadas anteriores deste mesmo teste contra o backend real
  const sufixo = Date.now();
  const tituloEditado = `QA Artigo Editado ${sufixo}`;

  // cria um artigo isolado para este teste não interferir com os outros
  const criado = await (
    await request.post(`${API_URL}/api/materiais`, {
      headers: { Authorization: ADMIN_AUTH },
      data: {
        titulo: `QA Artigo ${sufixo}`,
        descricao: 'Descrição original',
        categoria: 'QA',
        link: '/qa',
        arquivo: null,
        autor: 'QA',
      },
    })
  ).json();

  await page.reload();

  // h3 (título) -> .cardContent (pai) -> .card (avô), onde ficam os botões
  const card = page.getByText(criado.titulo, { exact: true }).locator('xpath=../..');
  await card.getByRole('button', { name: /editar/i }).click();

  const tituloInput = page
    .locator('[class*="modalGroup" i]', { hasText: 'Titulo do artigo' })
    .locator('input');
  await tituloInput.fill(tituloEditado);
  await page.getByRole('button', { name: /salvar artigo/i }).click();

  await expect(page.getByText(tituloEditado, { exact: true })).toBeVisible({ timeout: 10000 });

  let materialAtualizado = await (
    await request.get(`${API_URL}/api/materiais/${criado.id}`)
  ).json();
  expect(materialAtualizado.titulo).toBe(tituloEditado);
  expect(materialAtualizado.statusMaterial).toBe('ATIVO');

  const cardEditado = page
    .getByText(tituloEditado, { exact: true })
    .locator('xpath=../..');
  await cardEditado.getByRole('button', { name: /suspender/i }).click();

  await expect(cardEditado.getByText('SUSPENSO')).toBeVisible({ timeout: 10000 });

  materialAtualizado = await (
    await request.get(`${API_URL}/api/materiais/${criado.id}`)
  ).json();
  expect(materialAtualizado.statusMaterial).toBe('INATIVO');
});
