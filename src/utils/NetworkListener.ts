import { Browser, type Page } from 'puppeteer'
import { Plugins, type NetWorkType, type ProcessType } from '../types.js'

type IProps = {
    browser: Browser
    page: Page
    process: ProcessType
}

const NetworkListener = async ({
    page,
    process,
    browser,
}: IProps): Promise<NetWorkType[]> => {
    if (!process.plugins.includes(Plugins.NETWORK)) return []

    let net: NetWorkType[] = []
    const handleRequest = async (
        url: string,
        method: string,
        headers: Record<string, string>,
        body = '',
        initiator = ''
    ) => {
        net.push({
            url,
            status: '',
            method,
            headers,
            body,
            initiator,
        })
    }

    await page.setRequestInterception(true)
    page.on('request', async (request) => {
        const url = request.url()
        console.log('Normal ', { url })
        if (process.blockedDomains.includes(url)) {
            console.log('Aborted URL:', url)
            return request.abort().catch(() => {})
        }

        let body = ''
        try {
            if (request.method() === 'POST' && request.hasPostData()) {
                body = (await request.fetchPostData()) ?? ''
            }
        } catch {}

        await handleRequest(
            url,
            request.method(),
            request.headers(),
            body,
            request.initiator()?.toString() ?? ''
        )

        request.continue().catch(() => {})
    })

    page.on('response', async (response) => {
        const request = response.request()
        const index = net.findIndex(
            (entry) =>
                entry.url === request.url() && entry.method === request.method()
        )

        if (index !== -1) {
            net[index] && (net[index].status = response.status().toString())
        }
    })

    const setupWorker = async (target: any) => {
        if (target.type() === 'service_worker') {
            const client = await target.createCDPSession()
            await client.send('Network.enable')

            client.on('Network.requestWillBeSent', (event: any) => {
                const url = event?.request?.url
                console.log('SW: ', { url })
                if (process.blockedDomains.includes(url)) {
                    console.log('Aborted SW URL:', url)
                    client
                        .send('Network.failRequest', {
                            requestId: event.requestId,
                            errorReason: 'BlockedByClient',
                        })
                        .catch(() => {})
                    return
                }

                handleRequest(
                    event?.request?.url,
                    event?.request?.method,
                    event?.request?.headers,
                    event?.request?.postData ?? '',
                    event?.initiator?.type ?? 'service_worker'
                )
            })

            client.on('Network.responseReceived', async (event: any) => {
                const index = net.findIndex(
                    (entry) =>
                        entry.url === event.request?.url &&
                        entry.method === event.request?.method
                )
                if (index !== -1) {
                    net[index] &&
                        (net[index].status = event.response?.status.toString())
                }
            })
        }
    }

    const targets = browser.targets()
    for (const target of targets) {
        await setupWorker(target)
    }

    return net
}

export default NetworkListener
