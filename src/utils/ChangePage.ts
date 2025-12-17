import type { Browser, Page, PuppeteerLifeCycleEvent } from 'puppeteer'
import type { NetWorkType, ProcessType } from '../types.js'
import TrackingListener from './TrackingListener.js'
import NetworkListener from './NetworkListener.js'

type IProps = {
    browser: Browser
    process: ProcessType
    url?: string
    waitUntil?: PuppeteerLifeCycleEvent
}

const ChangePage = async ({
    browser,
    process,
    url,
    waitUntil = 'domcontentloaded',
}: IProps): Promise<{ page: Page; net: NetWorkType[] }> => {
    const pages = await browser.pages()
    const page = pages.length > 0 ? pages[0] : await browser.newPage()

    if (!!!page) throw new Error('Page not found')

    let net: NetWorkType[] = []
    if (!url) {
        net = await NetworkListener({ page, process, browser })
        await TrackingListener({ page, process })
    }

    await page.goto(url ?? process.url, {
        waitUntil,
        timeout: 100000,
    })

    return { page, net }
}

export default ChangePage
