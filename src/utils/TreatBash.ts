import CreateFolder from './GenerateFolder.js'
import { Plugins, type ProcessType } from '../types.js'
import CreateCookie from './CreateCookie.js'
import ChangePage from './ChangePage.js'
import ConsoleListener from './ConsoleListener.js'
import ParcourForm from './ParcourForm.js'
import type { Browser, Page } from 'puppeteer'
import GeneratePdf from './GeneratePdf.js'
import End from './End.js'
import GetTodayDateAndTime from './GetTodayDateAndTime.js'
import CreateFile from './CreateFile.js'
import RefactoParcours from './RefactoParcours.js'
import GenerateHTML from './GenerateHTML.js'

type IProps = {
    process: ProcessType
    browser: Browser
    reloadBrowser: boolean
}

const TreatBash = async ({
    process,
    browser,
    reloadBrowser,
}: IProps): Promise<{ reloadBrowser: boolean; page: Page }> => {
    const { name } = process

    if (process.plugins?.includes(Plugins.SCREENSHOT))
        CreateFolder('./screenshots/' + name)

    await CreateCookie({ browser, cookies: process.cookies })
    const { page, net } = await ChangePage({ browser, process })
    const csl = await ConsoleListener({ page, process })
    const parcours = await ParcourForm({ browser, page, process })

    await GeneratePdf({ parcours, page, process })

    reloadBrowser = process.reloadBrowser
    await End({ browser, process, page })

    const time = GetTodayDateAndTime()
    await CreateFile({
        array: parcours,
        fileName: `./output/parcours_${name}_${time}.json`,
    })
    await CreateFile({
        array: csl,
        fileName: `./output/console_${name}_${time}.json`,
    })
    await CreateFile({
        array: net,
        fileName: `./output/network_${name}_${time}.json`,
    })

    const refactoParcours = RefactoParcours(parcours)
    await GenerateHTML({ data: refactoParcours, process })

    return { reloadBrowser, page }
}

export default TreatBash
