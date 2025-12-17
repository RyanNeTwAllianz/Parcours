import type { Browser, Page } from 'puppeteer'
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
import AddJavaScript from './Trigger/AddJavaScript.js'
import ChangePage from './ChangePage.js'

type IProps = {
    browser: Browser
    page: Page
    process: ProcessType
}

const ParcourForm = async ({
    browser,
    page,
    process,
}: IProps): Promise<Parcours[]> => {
    let parcours: Parcours[] = []
    let previousUrl = page.url()
    let previousProcessName = ''

    if (!process.tests[0]) return []

    process.tests[0].commands.push({
        command: Commands.CHANGING_PAGE,
        target: '',
        value: '',
        comment: '',
    })

    for (let i = 0; i < process.tests[0].commands.length; i++) {
        const cmd = process.tests[0] && process.tests[0].commands[i]
        if (!cmd) continue

        const { command, target, value, comment } = cmd

        if ([Commands.CLICK, Commands.TYPE].includes(command)) {
            try {
                await page.waitForSelector(target, {
                    timeout: 30000,
                    visible: true,
                })
            } catch (e) {}
        }

        let digitalData = {} as DigitalData
        try {
            digitalData = (await page.evaluate('digitalData')) as DigitalData
        } catch (e) {}

        let currentUrl = digitalData?.page?.pageInfo?.URL ?? page.url()
        let parcour: Parcours = {
            currentUrl,
            previousUrl,
            index: i,
            target,
            command,
            skip: currentUrl === previousUrl,
            screenPath: '',
            processName: digitalData?.process?.processName,
            stepName: digitalData?.process?.stepName,
            previousProcessName,
            pageKey: digitalData?.azfr?.page?.pageKey,
            prevPageKey: digitalData?.azfr?.page?.prevPageKey,
            comment,
        }

        if (
            ![
                Commands.OPEN,
                Commands.SET_WINDOW_SIZE,
                Commands.SCRIPT,
            ].includes(command)
        )
            await ExecutePlugins({ process, page, target, parcour })

        parcours.push(parcour)
        previousUrl = currentUrl
        previousProcessName = digitalData?.process?.processName

        console.log(
            `Command ${command} targetting ${target} ${value ? `with value ${value}` : ''} ${comment ? `With comment ${comment}` : ''}`
        )
        switch (command) {
            case Commands.CLICK:
                await Click({ page, selector: target })
                break
            case Commands.TYPE:
                await Type({ page, selector: target, value })
                break
            case Commands.SCRIPT:
                await ExecuteScript({ page, script: value })
                break
            case Commands.CUSTOM:
                await AddJavaScript(value)
                break
            case Commands.OPEN:
                await ChangePage({
                    browser,
                    process,
                    url: value,
                    waitUntil: 'networkidle2',
                })
                break
            default:
                break
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return parcours
}

export default ParcourForm
