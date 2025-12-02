import type { Page } from 'puppeteer'
import {
    Commands,
    type DigitalData,
    type Parcours,
    type ProcessType,
} from '../types.js'
import Click from './Trigger/Click.js'
import Type from './Trigger/Type.js'
import ExecutePlugins from './ExecutePlugins.js'
import ExecuteScript from './Trigger/ExecuteScript.js'

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
        try {
            await page.waitForSelector('app-loading div', {
                timeout: 500,
                visible: false,
            })
            await page.waitForSelector('app-fast-quote, app-normal-quote', {
                timeout: 500,
                visible: true,
            })
            await new Promise((resolve) => setTimeout(resolve, 5000))
        } catch (e) {}

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

        if (
            ![
                Commands.OPEN,
                Commands.SET_WINDOW_SIZE,
                Commands.SCRIPT,
            ].includes(cmd.command)
        )
            await ExecutePlugins({ process, page, cleanTarget, parcour })

        parcours.push(parcour)
        previousUrl = currentUrl
        previousProcessName = digitalData.process.processName

        switch (cmd.command) {
            case Commands.CLICK:
                await Click({ page, selector: cleanTarget })
                break
            case Commands.TYPE:
                await Type({ page, selector: cleanTarget, value: cmd.value })
                break
            case Commands.SCRIPT:
                await ExecuteScript({ page, script: cmd.value })
                break
            default:
                console.log('Skipped command:', { cmd })
                break
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return parcours
}

export default ParcourForm
