import type { Page } from 'puppeteer'
import { Plugins, type Parcours, type ProcessType } from '../types.js'
import AddCss from './Trigger/AddCss.js'

type IProps = {
    process: ProcessType
    page: Page
    cleanTarget: string
    parcour: Parcours
}

const ExecutePlugins = async ({
    process,
    page,
    parcour,
    cleanTarget,
}: IProps) => {
    for (const plugin of process.plugins) {
        switch (plugin) {
            case Plugins.RED:
                await AddCss({
                    page,
                    selector: cleanTarget,
                    style: 'border:3px solid red;',
                })
                break
            case Plugins.SCREENSHOT:
                const screenPath = `./screenshots/${process.name}/${process.name}-${parcour.index}.png`
                await page.screenshot({
                    path: screenPath,
                    optimizeForSpeed: true,
                    fullPage: true,
                })
                parcour.screenPath = screenPath
                await new Promise((resolve) => setTimeout(resolve, 3000))
                break
            default:
                break
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
    }
}

export default ExecutePlugins
