import type { Browser, Page } from 'puppeteer'
import type { NetWorkType, ProcessType } from '../types.js'
import Click from './Trigger/Click.js'
import TrackingListener from './TrackingListener.js'
import NetworkListener from './NetworkListener.js'

type IProps = {
    browser: Browser
    process: ProcessType
}

const ChangePage = async ({
    browser,
    process,
}: IProps): Promise<{ page: Page; net: NetWorkType[] }> => {
    const pages = await browser.pages()
    const page = pages.length > 0 ? pages[0] : await browser.newPage()

    if (!!!page) throw new Error('Page not found')

    const net = await NetworkListener({ page, process, browser })
    await TrackingListener({ page, process })
    await page.goto(process.url, { waitUntil: 'networkidle2', timeout: 100000 })

    await Click({
        page,
        selector: process.acceptCookies
            ? '#az-cmp-btn-accept'
            : '#az-cmp-btn-refuse',
    })
    console.log('Cookies ', process.acceptCookies ? 'accpeted' : 'refused')

    return { page, net }
}

export default ChangePage
