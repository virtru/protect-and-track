import { test, expect } from '@playwright/test';
import { selectors } from "./helpers/selectors";
import { userAuthData } from './config';
import { encrypt, encryptAndDecrypt } from "./helpers/operations";
import * as fs from "fs/promises";

test.describe.configure({ mode: 'serial' });

let fileName;

test.fixme('For CKS user', () => {
	test('Encrypt/decrypt data A with a CKS user X, a CKS user using the JS SDK', async ({ browser }) => {
		const contextZ = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-cks/user.json' });
		const pageZ = await contextZ.newPage();
		await pageZ.goto('/');

		await encryptAndDecrypt({
			page: pageZ,
			recipientEmail: userAuthData.secondUser.login,
		});

		const downloadPromise = pageZ.waitForEvent('download');
		await pageZ.getByText(selectors.downloadTDFFileBtnText).click();
		const download = await downloadPromise;
		fileName = download.suggestedFilename();
		await download.saveAs(fileName);
		const fileContent = await fs.readFile(fileName);
		await expect(fileContent.toString()).toBeTruthy();
		await contextZ.close();
	});

	// Expected: Y can decrypt A_X
	test('Now, entitle user Y, who’s from the same org as X, also using CKS', async ({ browser }) => {
		const contextY = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-cks/user3.json' });
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

	// Expected: Z can decrypt A_X
	test('Entitle user W, who’s from a different org than X, NOT using CKS', async ({ browser }) => {
		const contextX = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-cks/user.json' });
		const pageX = await contextX.newPage();
		await pageX.goto('/');

		const downloadPromiseX = pageX.waitForEvent('download');

		await encrypt({
			page: pageX,
			recipientEmail: userAuthData.nonCKS.user1.login,
		});

		await pageX.getByText(selectors.downloadFileBtnText).click();
		await pageX.getByText(selectors.downloadTDFFileBtnText).click();
		const downloadX = await downloadPromiseX;
		fileName = downloadX.suggestedFilename();
		await downloadX.saveAs(fileName);
		await contextX.close();

		const contextW = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-non-cks/user1.json' });
		const pageW = await contextW.newPage();
		await pageW.goto('/');

		await pageW.locator(selectors.uploadInput).setInputFiles(fileName);
		const downloadPromise = pageW.waitForEvent('download');
		const download = await downloadPromise;
		await download.saveAs(fileName);
		const fileContent = await fs.readFile(fileName);
		expect(fileContent.toString()).toBe('Hello world!');
		await contextW.close();
		await fs.rm(fileName);
	});
})
