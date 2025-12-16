import GetArgsFromCmd from './utils/GetArgsFromCmd.js'
import ReadFile from './utils/ReadFile.js'
import type { BashType, ProcessType } from './types.js'
import TreatFile from './utils/TreatFile.js'
import FillProcessWithBash from './utils/FillProcessWithBash.js'
import Init from './utils/Init.js'
import TreatBash from './utils/TreatBash.js'
import End from './utils/End.js'

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

    for (const [i, arg] of args.entries()) {
        let file = await ReadFile<BashType | ProcessType>(arg)

        if (isFileType(file)) {
            console.log('Running file')

            if (reloadBrowser) browser = (await Init({ process: file })).browser
            if (!browser) continue

            const result = await TreatFile({
                fileName: arg,
                reloadBrowser,
                browser,
            })

            const { process, page } = result

            if (i + 1 === args.length && process.closeWindow) {
                process.reloadBrowser = true
                await End({ browser, process, page })
            }

            reloadBrowser = result.reloadBrowser
        } else if (isBashType(file)) {
            for (const [index, f] of file.tests.entries()) {
                console.log('Running bash')

                let process = await ReadFile<ProcessType>(f)
                process = FillProcessWithBash({ bash: file, process })
                process.name = f

                if (reloadBrowser) browser = (await Init({ process })).browser
                if (!browser) continue

                const result = await TreatBash({
                    process,
                    reloadBrowser,
                    browser,
                })

                if (index + 1 === file.tests.length && process.closeWindow) {
                    process.reloadBrowser = true
                    await End({ browser, process, page: result.page })
                }

                reloadBrowser = result.reloadBrowser
            }
        }
    }
}

await Main()

export default Main
