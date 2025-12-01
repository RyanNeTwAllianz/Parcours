import { WindowSize, type ProcessType } from '../types.js'

const GetWindowSize = (process: ProcessType): string => {
    let arg = '--window-size='

    switch (process.size) {
        case WindowSize.PHONE:
            return arg + '375,812'
        case WindowSize.TABLET:
            return arg + '1024,768'
        default:
            return arg + '1366,768'
    }
}

export default GetWindowSize
