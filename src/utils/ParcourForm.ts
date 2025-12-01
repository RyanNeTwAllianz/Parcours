import type { Page } from 'puppeteer'
import {
    Commands,
    Plugins,
    type DigitalData,
    type Parcours,
    type ProcessType,
} from '../types.js'
import Click from './Trigger/Click.js'
import Type from './Trigger/Type.js'
import ExecutePlugins from './ExecutePlugins.js'

type IProps = {
    page: Page
    process: ProcessType
}

const ParcourForm = async ({ page, process }: IProps): Promise<Parcours[]> => {
    let parcours: Parcours[] = []
    let previousUrl = page.url()
    let previousProcessName = ''

    if (!process.tests[0]) return []

    process.tests[0].commands.push({
        command: Commands.CHANGING_PAGE,
        target: '',
        value: '',
    })

    for (let i = 0; i < process.tests[0].commands.length; i++) {
        const cmd = process.tests[0].commands[i]
        if (!cmd) continue

        const cleanTarget = cmd.target.replace('css=', '')
        const digitalData = (await page.evaluate('digitalData')) as DigitalData

        let currentUrl = digitalData.page.pageInfo.URL
        let parcour: Parcours = {
            currentUrl,
            previousUrl,
            index: i,
            target: cleanTarget,
            command: cmd.command,
            skip: currentUrl === previousUrl,
            screenPath: '',
            previousProcessName,
            ...digitalData.process,
            ...digitalData.azfr.page,
        }

        if (![Commands.OPEN, Commands.SET_WINDOW_SIZE].includes(cmd.command))
            await ExecutePlugins({ process, page, cleanTarget, parcour })

        parcours.push(parcour)
        previousUrl = currentUrl
        previousProcessName = digitalData.process.processName

        console.log(cleanTarget, cmd.command)
        switch (cmd.command) {
            case Commands.CLICK:
                await Click({ page, selector: cleanTarget })
                console.log('ICI?????')
                break
            case Commands.TYPE:
                await Type({ page, selector: cleanTarget, value: cmd.value })
                break
            case Commands.CHANGING_PAGE:
            case Commands.CUSTOM:
                break
            default:
                console.log('Skipped command:', { cmd })
                continue
        }
    }

    return parcours
}

export default ParcourForm
