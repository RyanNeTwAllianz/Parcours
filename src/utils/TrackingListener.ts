import type { Page } from 'puppeteer'
import { Plugins, type ProcessType } from '../types.js'

type IProps = {
    page: Page
    process: ProcessType
}

const TrackingListener = async ({ page, process }: IProps): Promise<void> => {
    if (process.plugins.includes(Plugins.TRACKING))
        await page.tracing.start({
            path: './output/tracking_' + process.name + '.json',
        })
}

export default TrackingListener
