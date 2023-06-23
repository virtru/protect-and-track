import { test, expect } from '@playwright/test';
import { selectors } from './helpers/selectors';
import { userAuthData } from './config';
import { encryptDecryptProcedure } from './helpers/operations';
import * as fs from 'fs/promises';

test.describe.configure({ mode: 'serial' });

let fileName;
test.describe('For Non CKS users', () => {
	test('Encrypt/decrypt data B with user W, a non-CKS user using the JS SDK (hitting the SDK Proxy and SaaS backend)', async ({ browser }) => {
		const contextW = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-non-cks/user1.json' }); // W
		const pageW = await contextW.newPage();
		await pageW.goto('/');

		await encryptDecryptProcedure({
			page: pageW,
			recipientEmail: userAuthData.nonCKS.user2.login,
			full: true
		});

		const downloadPromise = pageW.waitForEvent('download');
		await pageW.getByText(selectors.downloadTDFFileBtnText).click();
		const download = await downloadPromise;
		fileName = download.suggestedFilename();
		await download.saveAs(fileName);
		const fileContent = await fs.readFile(fileName);
		expect(fileContent.toString()).toBeTruthy();
		await contextW.close();
	});

	test('Now, entitle user Y, who’s from the same org as W (also not using CKS)', async ({ browser }) => {
		// Expected: Y can decrypt B_W
		const contextY = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-non-cks/user2.json' });
		const pageY = await contextY.newPage();
		await pageY.goto('/');
		await pageY.locator(selectors.uploadInput).setInputFiles(fileName);
		const downloadPromise = pageY.waitForEvent('download');
		const download = await downloadPromise;
		await download.saveAs(fileName);
		const fileContent = await fs.readFile(fileName);
		expect(fileContent.toString()).toBe('Hello world!');
		await fs.rm(fileName);
		await contextY.close();
	});

	test('Now, entitle user Z, who’s from a different org than W, an org that is using CKS', async ({ browser, }) => {
		const contextW = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-non-cks/user1.json' }); // W
		const pageW = await contextW.newPage();
		await pageW.goto('/');

		await encryptDecryptProcedure({
			page: pageW,
			recipientEmail: userAuthData.mainUser.login,
		});

		const downloadPromiseW = pageW.waitForEvent('download');
		await pageW.getByText(selectors.downloadFileBtnText).click();
		await pageW.getByText(selectors.downloadTDFFileBtnText).click();
		const downloadW = await downloadPromiseW;
		fileName = downloadW.suggestedFilename();
		await downloadW.saveAs(fileName);
		await contextW.close();

		const contextZ = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-cks/user.json' });
		const pageZ = await contextZ.newPage();
		await pageZ.goto('/');

		await pageZ.locator(selectors.uploadInput).setInputFiles(fileName);
		const downloadPromise = pageZ.waitForEvent('download');
		const download = await downloadPromise;
		await download.saveAs(fileName);
		const fileContent = await fs.readFile(fileName);
		expect(fileContent.toString() === 'Hello world!').toBeTruthy();
		await contextZ.close();
		await fs.rm(fileName);
	});
});
