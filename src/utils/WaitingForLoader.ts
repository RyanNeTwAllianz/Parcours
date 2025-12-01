import type { Page } from 'puppeteer'

const WaitingForLoader = async (page: Page) => {
    try {
        await page.waitForSelector('app-loading div', {
            hidden: true,
            timeout: 30000,
        })
    } catch (e) {
        console.warn({ e })
    }
}

export default WaitingForLoader
