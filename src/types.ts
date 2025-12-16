import type { ConsoleMessageLocation } from 'puppeteer'

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

type CommandType = {
    command: Commands
    value: string
    target: string
    comment: string
}

export type CookieType = {
    comment: string
    name: string
    domain: string
    path: string
    'max-age': string
    value: string
}

export type ProcessType = {
    name: string
    url: string
    acceptCookies: boolean
    urlParams?: string
    reloadBrowser: boolean
    closeWindow: boolean
    blockedUrls?: string[]
    plugins: Plugins[]
    cookies?: CookieType[]
    size: string
    bashNumberList: number
    tests: {
        commands: CommandType[]
    }[]
}

export type BashType = {
    testsNameSuffix: string
    reloadBrowser: boolean
    size: string
    closeWindow: boolean
    parallelTests: number
    cookies?: CookieType[]
    blockedUrls?: string[]
    urlParams?: string
    plugins?: Plugins[]
    doBefore?: CommandType[]
    doAfter?: CommandType[]
    tests: string[]
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
        comment: string
    }

export type RefacoParcours = {
    stepName: ParcoursStepName
    parcours: Parcours[]
}

export type ConsoleType = {
    type: string
    text: string
    args: unknown[]
    loc: ConsoleMessageLocation
}

export type NetWorkType = {
    url: string
    status: string
    method: string
    initiator: string
    headers: Record<string, string>
    timestamp: string
    body: string
}
