import { test as setup } from '@playwright/test';
import { signInUser } from '../helpers/operations';
import { userAuthData } from '../config';

setup('authenticate', async ({ page }) => {
	const { mainUser } = userAuthData;
	await signInUser(
		page,
		{
			email: mainUser.login,
			password: mainUser.password,
			recoveryEmail: mainUser.email
		}
	);

	await page
		.context()
		.storageState({
			path: 'e2e/tests/playwright-test/.auth-cks/user.json'
		});
});