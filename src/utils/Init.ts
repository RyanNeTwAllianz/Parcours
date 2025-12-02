import puppeteer, { Browser, Page } from 'puppeteer'

const Init = async (): Promise<{ browser: Browser }> => {
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
            `--window-size=1280,800`,
        ],
    })
    console.log('Browser launched')

    return { browser }
}

export default Init
