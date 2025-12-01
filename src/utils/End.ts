import type { Browser } from 'puppeteer'

type IProps = {
    browser: Browser
    time?: number
}

const End = async ({ browser, time = 5000 }: IProps) => {
    await new Promise((resolve) => setTimeout(resolve, time))

    console.log('Closing browser')
    await browser.close()
    await new Promise((resolve) => setTimeout(resolve, 1000))
}

export default End
