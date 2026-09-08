import { test, expect } from '@playwright/test';

test('login com credenciais válidas de usuária comum leva ao perfil', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'lorena@gmail.com');
  await page.fill('input[name="senha"]', 'Lorena@123');
  await page.click('button[type=submit]');

  await page.waitForURL('**/perfil', { timeout: 10000 });
  await expect(page.getByText('Lorena Souza', { exact: false })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Meu perfil' })).toBeVisible();

  await page.getByRole('link', { name: 'Sobre' }).click();
  await page.waitForURL('**/sobre');
  await page.reload();
  await expect(page.getByRole('link', { name: 'Meu perfil' })).toBeVisible();

  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Artigos' })
    .click();
  await page.waitForURL('**/perfil#artigos');
  await expect(
    page.getByRole('heading', { name: /artigos pensados para/i })
  ).toBeInViewport();
  await expect(page.getByText('Cuidado e tecnologia', { exact: false })).toHaveCount(0);

  await page.reload();
  await expect(
    page.getByRole('heading', { name: /artigos pensados para/i })
  ).toBeInViewport();
});

test('login com credenciais de administrador leva ao painel administrativo', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@babybuddy.com.br');
  await page.fill('input[name="senha"]', 'Admin@123');
  await page.click('button[type=submit]');

  await page.waitForURL('**/administrador', { timeout: 10000 });
  await expect(
    page.getByRole('heading', { name: 'Dashboard Administrativo' }).first()
  ).toBeVisible();

  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Artigos' })
    .click();
  await page.waitForURL('**/administrador#artigos');
  await expect(
    page.getByRole('heading', { name: 'Gerenciamento de Artigos' }).first()
  ).toBeInViewport();
});

test('login com senha incorreta mostra erro do backend e não navega', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'lorena@gmail.com');
  await page.fill('input[name="senha"]', 'SenhaErrada123');
  await page.click('button[type=submit]');

  await expect(page.getByText('Usuário ou senha inválidos')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});
