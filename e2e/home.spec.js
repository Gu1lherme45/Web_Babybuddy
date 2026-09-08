import { test, expect } from '@playwright/test';

async function expectMenuGap(page, minimumGap) {
  await page.goto('/');

  const navigation = page.getByRole('navigation', {
    name: 'Navegação principal',
  });
  const heading = page.getByRole('heading', {
    name: /cuidado e tecnologia em cada etapa/i,
  });

  await expect(navigation).toBeVisible();
  await expect(heading).toBeVisible();

  const navigationBox = await navigation.boundingBox();
  const headingBox = await heading.boundingBox();

  expect(navigationBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(headingBox.y - (navigationBox.y + navigationBox.height)).toBeGreaterThanOrEqual(
    minimumGap
  );
}

test('hero mantém destaque do menu em desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await expectMenuGap(page, 32);
});

test('hero mantém destaque do menu em celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expectMenuGap(page, 24);
});
