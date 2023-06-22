import { test as baseTest } from "@playwright/test";
// @ts-ignore
import crypto from 'crypto'

export const generateRandomDigit = (max = 10, min = 0) =>
  crypto.randomInt(min, max)

export const test = baseTest.extend<{ attributeName: string; authority: string; attributeValue: string; }>({
    attributeName: async ({ page }, use) => {
        const attributeName = `randomName${generateRandomDigit(1000, 10)}`;

        await use(attributeName);
    },
    authority: async ({ page }, use) => {
        const authority = `https://opentdf${generateRandomDigit(10000000, 1)}.ua`;

        await use(authority);
    },
    attributeValue: async ({ page }, use) => {
        const attributeValue = `${generateRandomDigit(100, 1)}`;

        await use(attributeValue);
    },
});
