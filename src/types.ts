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
    NETWORK = 'network',
    TRACKING = 'tracking',
    HTML = 'html',
}

export enum WindowSize {
    PHONE = 'phone',
    PC = 'pc',
    TABLET = 'tablet',
}

export enum ParcoursStepName {
    DEVIS_FQ = 'devis fq',
    DEVIS_PL = 'devis pl',
    MER_EMAIL_FQ = 'mer email fq',
    MER_EMAIL_Pl = 'mer email pl',
    WCB = 'wcb',
    MER_AGENT_FQ = 'mer agent fq',
    MER_AGENT_PL = 'mer agent pl',
}

export type ProcessType = {
    name: string
    url: string
    acceptCookies: boolean
    reloadBrowser: boolean
    blockedDomains: string[]
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

export type NetWorkType = {
    url: string
    status: string
    method: string
    initiator: string
    headers: Record<string, string>
    body: string
}
