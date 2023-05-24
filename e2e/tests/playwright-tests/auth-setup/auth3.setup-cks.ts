import { test as setup } from '@playwright/test';
import { signInUser } from '../helpers/operations';
import { userAuthData } from '../config';

setup('authenticate', async ({ page }) => {
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
			path: 'e2e/tests/playwright-test/.auth-cks/user3.json'
		});
});