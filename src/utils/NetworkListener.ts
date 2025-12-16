import { Browser, HTTPRequest, type Page } from 'puppeteer'
import { Plugins, type NetWorkType, type ProcessType } from '../types.js'
import GetTodayDateAndTime from './GetTodayDateAndTime.js'

type IProps = {
    browser: Browser
    page: Page
    process: ProcessType
}

const shouldBlock = (url: string, blocked: string[]) => {
    try {
        const host = new URL(url).hostname
        return blocked?.some((d) => host.includes(d))
    } catch {
        return false
    }
}

const NetworkListener = async ({
    page,
    process,
    browser,
}: IProps): Promise<NetWorkType[]> => {
    if (!(process.plugins ?? []).includes(Plugins.NETWORK)) return []

    const net: NetWorkType[] = []
    const blocked = (process.blockedUrls ?? []).map((d) => `*${d}*`)

    const addRequest = (
        url: string,
        method: string,
        headers: Record<string, string>,
        timestamp: string,
        body = '',
        initiator = ''
    ) => {
        net.push({
            url,
            method,
            headers,
            timestamp,
            body,
            status: '',
            initiator,
        })
    }

    const client = await page.target().createCDPSession()
    await client.send('Network.enable')
    if (blocked?.length)
        await client.send('Network.setBlockedURLs', { urls: blocked })

    client.on('Network.requestWillBeSent', (e: any) => {
        const r = e.request
        if (!r?.url) return
        addRequest(
            r.url,
            r.method,
            r.headers || {},
            e.timestamp?.toString(),
            r.postData ?? '',
            e.initiator?.type || 'other'
        )
    })

    client.on('Network.responseReceived', (e: any) => {
        const i = net.findIndex((req) => req.url === e.response.url)
        if (i !== -1) net[i] && (net[i].status = e.response.status.toString())
    })

    page.on('request', async (req: HTTPRequest) => {
        const url = req.url()

        if (shouldBlock(url, process.blockedUrls ?? [])) {
            return req.abort().catch(() => {})
        }

        let body = ''
        try {
            if (req.method() === 'POST' && req.hasPostData()) {
                body = (await req.fetchPostData()) ?? ''
            }
        } catch {}

        addRequest(
            url,
            req.method(),
            req.headers(),
            GetTodayDateAndTime(),
            body,
            req.initiator()?.type || ''
        )

        req.continue().catch(() => {})
    })

    await page.setRequestInterception(true)

    const setupWorker = async (target: any) => {
        if (target.type() !== 'service_worker') return

        const sw = await target.createCDPSession()
        await sw.send('Network.enable')
        await sw.send('Network.setBlockedURLs', { urls: blocked })

        sw.on('Network.requestWillBeSent', (e: any) => {
            const r = e.request
            if (r?.url) {
                addRequest(
                    r.url,
                    r.method,
                    r.headers || {},
                    r.timestamp?.toString(),
                    r.postData ?? '',
                    'service_worker'
                )
            }
        })

        sw.on('Network.responseReceived', (e: any) => {
            const i = net.findIndex((req) => req.url === e.response.url)
            if (i !== -1)
                net[i] && (net[i].status = e.response.status.toString())
        })
    }

    browser.targets().forEach(setupWorker)
    browser.on('targetcreated', setupWorker)

    return net
}

export default NetworkListener
