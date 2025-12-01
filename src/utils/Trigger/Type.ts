import type { Page } from 'puppeteer'

type IProps = {
    page: Page
    selector: string
    value: string
}

const Type = async ({ page, selector, value }: IProps): Promise<void> => {
    try {
        await page.waitForSelector(selector, { visible: true, timeout: 5000 })
        await page.type(selector, value, { delay: 120 })
    } catch (e) {
        console.log(e)
    }
}

export default Type
