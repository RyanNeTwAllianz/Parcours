import type { Page } from 'puppeteer'
import { Plugins, type ConsoleType, type ProcessType } from '../types.js'

type IProps = {
    page: Page
    process: ProcessType
}

const ConsoleListener = async ({
    page,
    process,
}: IProps): Promise<ConsoleType[]> => {
    if (!process.plugins.includes(Plugins.CONSOLE)) return []

    let csl: ConsoleType[] = []
    page.on('console', (message) =>
        csl.push({
            type: message.type().toUpperCase(),
            text: message.text(),
            loc: JSON.stringify(message.location()),
        })
    )

    return csl
}

export default ConsoleListener
