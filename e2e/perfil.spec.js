import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8080';
const ADMIN_AUTH = `Basic ${Buffer.from('admin@babybuddy.com.br:Admin@123').toString('base64')}`;

async function cadastrarNovaUsuaria(page, email) {
  await page.goto('/cadastro');
  await page.fill('#nome', 'QA Perfil');
  await page.fill('#email', email);
  await page.fill('#telefone', '11999999999');
  await page.fill('#senha', 'Senha@123');
  await page.fill('#confirmarSenha', 'Senha@123');
  await page.click('input[type=checkbox]');
  await page.click('button[type=submit]');

  await page.waitForURL('**/questionario', { timeout: 10000 });
  await page.goto('/perfil');
}

test('editar nome no perfil persiste via PUT /api/usuarios/{id}', async ({ page, request }) => {
  const email = `qa+perfil+${Date.now()}@babybuddy.com`;
  await cadastrarNovaUsuaria(page, email);

  await page.locator('[class*="avatar" i]').first().click(); // abre a sidebar
  await page.getByRole('button', { name: /editar perfil/i }).click();

  const campoNome = page.locator('[class*="informacoesUsuario" i] input').first();
  await campoNome.fill('QA Perfil Editado');

  await page.getByRole('button', { name: /salvar alterações/i }).click();
  await expect(page.getByRole('button', { name: /editar perfil/i })).toBeVisible({
    timeout: 10000,
  });

  const usuarios = await (
    await request.get(`${API_URL}/api/usuarios`, { headers: { Authorization: ADMIN_AUTH } })
  ).json();
  const usuaria = usuarios.find((u) => u.username === email);

  expect(usuaria).toBeTruthy();
  expect(usuaria.nome).toBe('QA Perfil Editado');
});

test('trocar senha persiste via PATCH /api/usuarios/{id}/senha e permite novo login', async ({
  page,
  request,
}) => {
  const email = `qa+senha+${Date.now()}@babybuddy.com`;
  await cadastrarNovaUsuaria(page, email);

  await page.locator('[class*="avatar" i]').first().click();
  await page.getByRole('button', { name: /editar perfil/i }).click();
  await page.getByRole('button', { name: /alterar senha/i }).click();

  await page.fill('input[placeholder="Nova senha"]', 'NovaSenha@123');
  await page.fill('input[placeholder="Confirmar nova senha"]', 'NovaSenha@123');
  await page.getByRole('button', { name: /salvar nova senha/i }).click();

  await expect(page.getByRole('button', { name: /alterar senha/i })).toBeVisible({
    timeout: 10000,
  });

  // confirma no backend com HTTP Basic usando a nova senha
  const res = await request.get(`${API_URL}/api/usuarios/me`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${email}:NovaSenha@123`).toString('base64')}`,
    },
  });
  expect(res.ok()).toBe(true);
});
