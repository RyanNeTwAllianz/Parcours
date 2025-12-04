import puppeteer, { Browser, Page } from 'puppeteer'
import type { ProcessType } from '../types.js'

type IProps = {
    process: ProcessType
}

const Init = async ({ process }: IProps): Promise<{ browser: Browser }> => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        args: [
            '--no-sandbox',
            '--disable-features=SameSiteByDefaultCookies',
            '--enable-features=CookiesWithoutSameSiteMustBeSecure',
            '--disable-third-party-cookie-blocking',
            '--disable-web-security',
            '--proxy-server=127.0.0.1:9000',
            '--enable-features=NetworkService',
            `--window-size=${process.size ?? '1366,768'}`,
        ],
    })
    console.log('Browser launched')

    return { browser }
}

export default Init
