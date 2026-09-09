import { test, expect} from '@playwright/test';

test('deve carregar a página inicial do Qualiducation com sucesso', async({ page }) => {
	// Acede á tua aplicação Next.js local
	await page.goto('http://localhost:3000');
	
	// Valida o título "Hello Next.js 👋" visivel na tela
	const heading = page.locator('text=Hello Next.js 👋');
	await expect(heading).toBeVisible();
	
	// Valida a barra de navegação e botões principais
	await expect(page.locator('text=Qualiducation')).toBeVisible();
	await expect(page.locator('text=Sign Up For Free')).toBeVisible();
	
});

test('deve navegar para a página About ao clicar no link', async ({ page }) => {
	await page.goto('http://localhost:3000');
	
	// Clica no link About
	await page.click('text=About');
	
	// Valida se a URL mudou para /about
	await expect(page).toHaveURL(/.*about/);
});

test('deve preencher o login e redirecionar para a home com sucesso', async ({ page }) => {
  // 1. Intercepta a rota da API
  await page.route('**/api/users/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          email: 'teste@email.com',
          token: 'jwt-falso-de-teste',
          username: 'usuario_teste',
          bio: null,
          image: null
        }
      }),
    });
  });

  // 2. Vai para a página de login
  await page.goto('http://localhost:3000/login');

  // 3. Preenche os campos
  await page.locator('input[type="email"], input[name="email"]').fill('teste@email.com');
  await page.locator('input[type="password"], input[name="password"]').fill('senha123');

  // 4. Clica no botão LOGIN
  await page.locator('button:has-text("LOGIN")').click();

  // 5. ASSERT: Espera o redirecionamento para fora da rota /login
  await expect(page).toHaveURL('http://localhost:3000/');
});
