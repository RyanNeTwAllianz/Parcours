export enum Commands {
    CLICK = 'click',
    TYPE = 'type',
    SET_WINDOW_SIZE = 'setWindowSize',
    OPEN = 'open',
    CUSTOM = 'custom',
    CHANGING_PAGE = 'changing_page',
    SCRIPT = 'script',
}

export enum Plugins {
    SCREENSHOT = 'screenshot',
    RED = 'red',
    PDF = 'pdf',
    CONSOLE = 'console',
}

export enum WindowSize {
    PHONE = 'phone',
    PC = 'pc',
    TABLET = 'tablet',
}

export enum ParcoursStepName {
    DEVIS_FQ = 'devis fq',
    DEVIS_PL = 'devis pl',
}

export type ProcessType = {
    name: string
    url: string
    acceptCookies: boolean
    reloadBrowser: boolean
    plugins: Plugins[]
    size: WindowSize
    tests: {
        commands: {
            command: Commands
            target: string
            value: string
        }[]
    }[]
}

export type DigitalData = {
    process: {
        processName: string
        stepName: string
    }
    azfr: {
        page: {
            pageKey: string
            prevPageKey: string
        }
    }
    page: {
        pageInfo: {
            URL: string
        }
    }
}

export type Parcours = DigitalData['process'] &
    DigitalData['azfr']['page'] & {
        currentUrl: string
        target: string
        previousUrl: string
        index: number
        screenPath: string
        command: Commands
        previousProcessName: string
        skip: boolean
    }

export type RefacoParcours = {
    stepName: ParcoursStepName
    parcours: Parcours[]
}

export type ConsoleType = {
    type: string
    text: string
    loc: string
}
