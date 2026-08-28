import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8080';
const ADMIN_AUTH = `Basic ${Buffer.from('admin@babybuddy.com.br:Admin@123').toString('base64')}`;

async function preencherFormulario(page, { nome, email, telefone = '11999999999', senha = 'Senha@123' }) {
  await page.goto('/cadastro');
  await page.fill('#nome', nome);
  await page.fill('#email', email);
  await page.fill('#telefone', telefone);
  await page.fill('#senha', senha);
  await page.fill('#confirmarSenha', senha);
  await page.click('input[type=checkbox]');
  await page.click('button[type=submit]');
}

test('cadastro grava o usuário no banco via backend real', async ({ page, request }) => {
  const email = `qa+${Date.now()}@babybuddy.com`;

  await preencherFormulario(page, { nome: 'QA Automatizado', email });

  await expect(page.getByText('Cadastro realizado com sucesso!')).toBeVisible();

  const res = await request.get(`${API_URL}/api/usuarios`, {
    headers: { Authorization: ADMIN_AUTH },
  });
  expect(res.ok()).toBe(true);

  const usuarios = await res.json();
  const criado = usuarios.find((u) => u.username === email);
  expect(criado).toBeTruthy();
  expect(criado.nome).toBe('QA Automatizado');
});

test('cadastro com e-mail já existente não conclui com sucesso', async ({ page }) => {
  const email = `qa+dup+${Date.now()}@babybuddy.com`;

  await preencherFormulario(page, { nome: 'QA Duplicado', email });
  await expect(page.getByText('Cadastro realizado com sucesso!')).toBeVisible();

  await preencherFormulario(page, { nome: 'QA Duplicado 2', email });
  await expect(page.getByText('Cadastro realizado com sucesso!')).not.toBeVisible();
});

test('senhas diferentes bloqueiam o envio antes de chamar o backend', async ({ page }) => {
  await page.goto('/cadastro');
  await page.fill('#nome', 'QA Senhas');
  await page.fill('#email', `qa+senha+${Date.now()}@babybuddy.com`);
  await page.fill('#telefone', '11999999999');
  await page.fill('#senha', 'Senha@123');
  await page.fill('#confirmarSenha', 'OutraSenha@123');
  await page.click('input[type=checkbox]');
  await page.click('button[type=submit]');

  await expect(page.getByText('As senhas não coincidem.')).toBeVisible();
});
