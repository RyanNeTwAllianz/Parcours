import type { BashType, ProcessType } from '../types.js'

type IProps = {
    bash: BashType
    process: ProcessType
}

const FillProcessWithBash = ({ bash, process }: IProps): ProcessType => {
    const {
        plugins,
        blockedUrls,
        urlParams,
        doAfter,
        doBefore,
        size,
        reloadBrowser,
        cookies,
    } = bash

    process.size = size
    process.reloadBrowser = reloadBrowser
    process.cookies = cookies ?? []
    process.bashNumberList = bash.tests.length

    process.plugins = plugins?.length ? plugins : (process.plugins ?? [])

    process.blockedUrls = blockedUrls?.length
        ? blockedUrls
        : (process.blockedUrls ?? [])

    process.url = urlParams
        ? process.url + urlParams
        : process.urlParams
          ? process.url + process.urlParams
          : process.url

    doBefore?.length &&
        process.tests[0] &&
        process.tests[0].commands.unshift(...doBefore)

    doAfter?.length &&
        process.tests[0] &&
        process.tests[0].commands.push(...doAfter)

    return process
}

export default FillProcessWithBash
