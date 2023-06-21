import { Page, expect } from '@playwright/test'
import { selectors } from './selectors';
// import * as fs from 'fs';
import * as fs from 'fs/promises';

const gmail = {
    loginView: {
        identifierInput: '#identifierId',
        identifierNextBtn: '#identifierNext',
        passwordInput: 'input[type="password"]',
        passwordNextBtn: '#passwordNext',
    },
    composeBtn: 'div[role=button]:has-text("Compose")',
    verifyView: {
        recoveryEmailItem: 'div[data-challengetype="12"]',
        recoveryEmailInput: '#knowledge-preregistered-email-response',
        nextBtn: 'button:has-text("Next")',
        notNowBtn: 'button[class]:has-text("Not now")',
    },
};

export const signInUser = async (
  page: Page,
  userObject: { email: string, password: string, recoveryEmail: string },
  { selectorAwaited = undefined, checkInitialValue = false } = {}
) => {
    await page.goto('https://gmail.com', { waitUntil: 'commit' });

    if (checkInitialValue) {
        await expect(page.locator(gmail.loginView.identifierInput))
          .toHaveAttribute('data-initial-value', userObject.email, { timeout: 10000 });
    } else {
        await page.waitForSelector(gmail.loginView.identifierInput, { state: 'visible', timeout: 60000 });
        await page.locator(gmail.loginView.identifierInput).fill(userObject.email);
    }
    await page.locator(gmail.loginView.identifierNextBtn).click();
    await page.waitForSelector(gmail.loginView.passwordInput, { state: 'visible', timeout: 30000 });
    await page.locator(gmail.loginView.passwordInput).fill(userObject.password);
    await page.locator(gmail.loginView.passwordNextBtn).click();

    const selector = selectorAwaited === undefined ? gmail.composeBtn : selectorAwaited;
    const { recoveryEmailItem } = gmail.verifyView;
    const { notNowBtn } = gmail.verifyView;
    await page.waitForSelector(`:is(${selector}, ${recoveryEmailItem}, ${notNowBtn})`, { timeout: 60000 });
    if (await page.isVisible(recoveryEmailItem)) {
        await page.locator(recoveryEmailItem).click();
        await page.locator(gmail.verifyView.recoveryEmailInput).fill(userObject.recoveryEmail);
        await page.locator(gmail.verifyView.nextBtn).click();
        await page.locator(selector).waitFor({ state: 'visible', timeout: 60000 });
    }
    if (await page.isVisible(notNowBtn)) await page.locator(notNowBtn).click();

    await page.goto('/');

    await page.waitForSelector(selectors.firstScreen.unsupportedModal.continueAnywayBtn);
    await page.locator(selectors.firstScreen.unsupportedModal.continueAnywayBtn).click();

    await page.locator(selectors.loginButton).click();
    await page.locator(selectors.loginGoogleButton).click();

    await page.waitForURL('https://local.virtru.com/');
    await page.waitForSelector(selectors.logoutButton);
}

type EncryptDecryptProcedure = {
    page: Page,
    recipientEmail?: string,
    full?: boolean
}

export const encryptDecryptProcedure = async ({ page, recipientEmail, full }: EncryptDecryptProcedure) => {
    await page.locator(selectors.draggableItem).dragTo(page.locator(selectors.dropZone));

    if (recipientEmail) {
        await page.fill('input[type=email]', recipientEmail);
        await page.getByText(selectors.grantBtnText).click();
        await expect(page.getByText(selectors.revokeBtnText)).toBeVisible();
    }

    await page.getByText(selectors.protectFileBtnText).click();

    if (full) {
        const responsePublicKey = await page.waitForResponse('**/auth/oidc/public-key');
        await expect(responsePublicKey.status()).toEqual(200);

        const responseToken = await page.waitForResponse('**/oauth2/default/v1/token');
        await expect(responseToken.status()).toEqual(200);

        const responseEntityObject = await page.waitForResponse('**/accounts/api/entityobject');
        await expect(responseEntityObject.status()).toEqual(200);

        const responseUserSettings = await page.waitForResponse('**/accounts/api/userSettings');
        await expect(responseUserSettings.status()).toEqual(200);

        const responseUpsert = await page.waitForResponse('**/kas/upsert');
        await expect(responseUpsert.status()).toEqual(200);
        await page.getByText(selectors.downloadFileBtnText).click();

        const downloadPromise = page.waitForEvent('download');
        await page.getByText(selectors.decryptAndDownloadBtnText).click();
        // Start waiting for download before clicking. Note no await.
        const download = await downloadPromise;
        const fileName = download.suggestedFilename();
        // Wait for the download process to complete
        // console.log(await download.path());
        // Save downloaded file somewhere
        await download.saveAs(fileName);
        const fileContent = await fs.readFile(fileName);
        expect(fileContent.toString() === 'Hello world!').toBeTruthy();
        await fs.rm(fileName);
    }
};


