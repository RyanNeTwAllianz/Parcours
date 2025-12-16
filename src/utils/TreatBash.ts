import CreateFolder from './GenerateFolder.js'
import type { ProcessType } from '../types.js'
import CreateCookie from './CreateCookie.js'
import ChangePage from './ChangePage.js'
import ConsoleListener from './ConsoleListener.js'
import ParcourForm from './ParcourForm.js'
import type { Browser } from 'puppeteer'
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
    closeWindow: boolean
    index: number
}

const TreatBash = async ({
    process,
    browser,
    reloadBrowser,
    closeWindow,
    index,
}: IProps) => {
    const { name } = process
    CreateFolder('./screenshots/' + name)

    await CreateCookie({ browser, cookies: process.cookies })
    const { page, net } = await ChangePage({ browser, process })
    const csl = await ConsoleListener({ page, process })
    const parcours = await ParcourForm({ page, process })

    await GeneratePdf({ parcours, page, process })

    reloadBrowser =
        process.bashNumberList === index + 1 || closeWindow
            ? true
            : process.reloadBrowser
    process.reloadBrowser = reloadBrowser
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
}

export default TreatBash
