import { test as setup } from '@playwright/test';
import { signInUser } from '../helpers/operations';
import { userAuthData } from '../config/index';

setup('authenticate 3', async ({ page }) => {
	const { mainUser, secondUser } = userAuthData;

	await signInUser(
		page,
		{
			email: secondUser.login,
			password: secondUser.password,
			recoveryEmail: mainUser.email
		}
	);

	await page
		.context()
		.storageState({
			path: 'e2e/tests/playwright-tests/.auth-cks/user3.json'
		});
	await page.close();
});