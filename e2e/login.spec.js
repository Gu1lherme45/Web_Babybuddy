import { test, expect } from '@playwright/test';

test('login com credenciais válidas de usuária comum leva ao perfil', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'lorena@gmail.com');
  await page.fill('input[name="senha"]', 'Lorena@123');
  await page.click('button[type=submit]');

  await page.waitForURL('**/perfil', { timeout: 10000 });
  await expect(page.getByText('Lorena Souza', { exact: false })).toBeVisible();
});

test('login com credenciais de administrador leva ao painel administrativo', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@babybuddy.com.br');
  await page.fill('input[name="senha"]', 'Admin@123');
  await page.click('button[type=submit]');

  await page.waitForURL('**/administrador', { timeout: 10000 });
  await expect(page.getByText('Dashboard Administrativo')).toBeVisible();
});

test('login com senha incorreta mostra erro do backend e não navega', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'lorena@gmail.com');
  await page.fill('input[name="senha"]', 'SenhaErrada123');
  await page.click('button[type=submit]');

  await expect(page.getByText('Usuário ou senha inválidos')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});
