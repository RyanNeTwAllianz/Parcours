import type { Page } from 'puppeteer'

type IProps = {
    page: Page
    selector: string
}

const Click = async ({ page, selector }: IProps): Promise<void> => {
    try {
        await page.waitForSelector(selector, { visible: true, timeout: 10000 })
        await page.click(selector, { delay: 240 })
    } catch (e) {
        console.log(e)
    }
}

export default Click
