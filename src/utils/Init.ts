import puppeteer from 'puppeteer'
import Click from './Trigger/Click.js'
import type { ProcessType } from '../types.ts'

type IProps = {
    process: ProcessType
}

const Init = async ({ process }: IProps) => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: false,
        args: [
            '--no-sandbox',
            '--disable-features=SameSiteByDefaultCookies',
            '--enable-features=CookiesWithoutSameSiteMustBeSecure',
            '--disable-third-party-cookie-blocking',
            '--disable-web-security',
            '--proxy-server=127.0.0.1:9000',
            `--window-size=1280,800`,
        ],
    })
    console.log('Browser launched')

    const pages = await browser.pages()
    const page = pages.length > 0 ? pages[0] : await browser.newPage()

    if (!!!page) throw new Error('Page not found')

    await page.goto(process.url, { waitUntil: 'networkidle2', timeout: 100000 })

    await Click({
        page,
        selector: process.acceptCookies
            ? '#az-cmp-btn-accept'
            : '#az-cmp-btn-refuse',
    })
    console.log('Cookies ' + process.acceptCookies ? 'accpeted' : 'refused')

    return { browser, page }
}

export default Init
