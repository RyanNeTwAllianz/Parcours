import type { Page } from 'puppeteer'
import { Plugins, type ProcessType } from '../types.js'
import GetTodayDateAndTime from './GetTodayDateAndTime.js'

type IProps = {
    page: Page
    process: ProcessType
}

const TrackingListener = async ({ page, process }: IProps): Promise<void> => {
    if ((process.plugins ?? []).includes(Plugins.TRACKING)) {
        const time = GetTodayDateAndTime()
        await page.tracing.start({
            path: `./output/tracking_${process.name}_${time}.json`,
        })
    }
}

export default TrackingListener
