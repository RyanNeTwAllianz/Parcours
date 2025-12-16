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
    if (!(process.plugins ?? []).includes(Plugins.CONSOLE)) return []

    let csl: ConsoleType[] = []
    page.on('console', async (message) => {
        const args = message.args()
        const resolvedArgs = []

        for (const arg of args) {
            try {
                const val = await arg.jsonValue()
                resolvedArgs.push(val)
            } catch {
                resolvedArgs.push('[unserializable]')
            }
        }

        csl.push({
            type: message.type().toUpperCase(),
            text: message.text(),
            args: resolvedArgs,
            loc: message.location(),
        })
    })

    return csl
}

export default ConsoleListener
