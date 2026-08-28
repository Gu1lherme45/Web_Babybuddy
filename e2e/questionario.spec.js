import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8080';
const ADMIN_AUTH = `Basic ${Buffer.from('admin@babybuddy.com.br:Admin@123').toString('base64')}`;

async function cadastrarNovaUsuaria(page, email) {
  await page.goto('/cadastro');
  await page.fill('#nome', 'QA Questionario');
  await page.fill('#email', email);
  await page.fill('#telefone', '11999999999');
  await page.fill('#senha', 'Senha@123');
  await page.fill('#confirmarSenha', 'Senha@123');
  await page.click('input[type=checkbox]');
  await page.click('button[type=submit]');

  await page.waitForURL('**/questionario', { timeout: 10000 });
}

test('preencher o questionário completo grava Gestante e Questionario no banco', async ({
  page,
  request,
}) => {
  const email = `qa+quest+${Date.now()}@babybuddy.com`;
  await cadastrarNovaUsuaria(page, email);

  await page.click('text=INICIAR QUESTIONÁRIO DE SAÚDE');

  // 1. data de nascimento
  await page.fill('input[type="date"]', '1996-05-20');
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 2. tipo sanguíneo
  await page.selectOption('select', 'O+');
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 3. já teve parto
  await page.getByRole('button', { name: 'Não', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 4. primeira gestação
  await page.getByRole('button', { name: 'Sim', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 5. semana de gestação
  await page.selectOption('select', '12');
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 6. data prevista para o parto
  await page.fill('input[type="date"]', '2026-12-01');
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 7. possui problema de saúde
  await page.getByRole('button', { name: 'Não', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 8. condição de saúde
  await page.selectOption('select', 'Hipertensão');
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 9. acompanhamento pré-natal
  await page.getByRole('button', { name: 'Sim', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 10. alergia
  await page.getByRole('button', { name: 'Não', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 11. ciclo regular
  await page.getByRole('button', { name: 'Sim', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 12. autoriza uso de dados
  await page.getByRole('button', { name: 'Sim', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // 13. termos
  await page.click('input[type=checkbox]');
  await page.getByRole('button', { name: 'Finalizar questionario' }).click();

  await expect(page.getByText('Tudo pronto!')).toBeVisible({ timeout: 10000 });

  // confirma no backend: usuária -> gestante -> questionário
  const usuarios = await (
    await request.get(`${API_URL}/api/usuarios`, { headers: { Authorization: ADMIN_AUTH } })
  ).json();
  const usuaria = usuarios.find((u) => u.username === email);
  expect(usuaria).toBeTruthy();

  const gestantes = await (
    await request.get(`${API_URL}/api/gestantes`, { headers: { Authorization: ADMIN_AUTH } })
  ).json();
  const gestante = gestantes.find((g) => g.usuario?.id === usuaria.id);
  expect(gestante).toBeTruthy();
  expect(gestante.dataNascimento).toBe('1996-05-20');
  expect(gestante.tipoSanguineo).toBe('O+');

  const questionarios = await (
    await request.get(`${API_URL}/api/questionarios/gestante/${gestante.id}`, {
      headers: { Authorization: ADMIN_AUTH },
    })
  ).json();

  expect(questionarios.length).toBeGreaterThan(0);
  const questionario = questionarios[0];
  expect(questionario.semanaGestacional).toBe(12);
  expect(questionario.primeiraGestacao).toBe('sim');
  expect(questionario.condicaoSaude).toBe('Hipertensao');
  expect(questionario.prenatalRegular).toBe('Sim');
  expect(questionario.possuiAlergia).toBe('nao');
  expect(questionario.aceiteTermos).toBe(true);
  expect(questionario.dataPrevistaParto).toBe('2026-12-01');
});
