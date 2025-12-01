import type { Page } from 'puppeteer'

type IProps = {
    page: Page
    selector: string
    style: string
}

const AddCss = async ({ page, selector, style }: IProps): Promise<void> => {
    if (!selector.length) return

    try {
        await page.waitForSelector(selector, { visible: true, timeout: 5000 })
        await page.evaluate(
            (sel, css) => {
                const el = document.querySelector(sel)
                if (el) {
                    el.setAttribute('style', css)
                }
            },
            selector,
            style
        )
    } catch (e) {
        console.log(e)
    }
}

export default AddCss
