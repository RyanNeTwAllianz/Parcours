import GetArgsFromCmd from './utils/GetArgsFromCmd.js'
import ReadFile from './utils/ReadFile.js'
import type { BashType, ProcessType } from './types.js'
import TreatFile from './utils/TreatFile.js'
import FillProcessWithBash from './utils/FillProcessWithBash.js'
import Init from './utils/Init.js'
import TreatBash from './utils/TreatBash.js'

const isBashType = (file: BashType | ProcessType): file is BashType => {
    return typeof file.tests[0] === 'string'
}

const isFileType = (file: BashType | ProcessType): file is ProcessType => {
    return typeof file.tests[0] === 'object'
}

const Main = async () => {
    const args = GetArgsFromCmd()
    let browser = null
    let reloadBrowser = true
    const closeWindow = true

    for (const arg of args) {
        let file = await ReadFile<BashType | ProcessType>(arg)

        if (isFileType(file)) {
            console.log('Running file')

            if (reloadBrowser) browser = (await Init({ process: file })).browser
            if (!browser) continue

            await TreatFile({
                fileName: arg,
                reloadBrowser,
                browser,
                closeWindow,
                index: 0,
            })
        } else if (isBashType(file)) {
            for (const [index, f] of file.tests.entries()) {
                console.log('Running bash')

                let process = await ReadFile<ProcessType>(f)
                process = FillProcessWithBash({ bash: file, process })
                process.name = f

                if (reloadBrowser) browser = (await Init({ process })).browser
                if (!browser) continue

                await TreatBash({
                    process,
                    reloadBrowser,
                    browser,
                    closeWindow,
                    index,
                })
            }
        }
    }
}

await Main()

export default Main
