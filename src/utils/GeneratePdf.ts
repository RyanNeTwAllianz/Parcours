import type { Page } from 'puppeteer'
import { Plugins, type Parcours, type ProcessType } from '../types.js'
import { readFileSync, existsSync } from 'node:fs'
import GetTodayDateAndTime from './GetTodayDateAndTime.js'

type IProps = {
    parcours: Parcours[]
    page: Page
    process: ProcessType
}

const GeneratePdf = async ({ parcours, page, process }: IProps) => {
    if (!(process.plugins ?? []).includes(Plugins.PDF)) return

    let html = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                .item {
                    border: 1px solid #ddd;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 8px;
                }
                .item h2 {
                    margin-top: 0;
                }
                img {
                    max-width: 500px;
                    margin-top: 10px;
                    border: 1px solid #999;
                }
            </style>
        </head>
        <body>
            <h1>Rapport des actions Puppeteer</h1>
    `

    for (const parcour of parcours) {
        html += `
            <div class="item">
                <h2>Étape #${parcour.index}</h2>
                <p><strong>Command :</strong> ${parcour.command}</p>
                <p><strong>URL courante :</strong> ${parcour.currentUrl}</p>
                <p><strong>URL précédente :</strong> ${parcour.previousUrl}</p>
        `

        if (parcour.screenPath && existsSync(parcour.screenPath)) {
            const base64Image = readFileSync(parcour.screenPath, {
                encoding: 'base64',
            })
            html += `<img src="data:image/png;base64,${base64Image}" />`
        }

        html += `</div>`
    }

    html += `
        </body>
        </html>
    `

    await page.setContent(html, { waitUntil: 'load', timeout: 60000 })
    await page.pdf({
        path: `./output/pdf_${process.name}_${GetTodayDateAndTime()}.pdf`,
        format: 'A4',
        printBackground: true,
    })

    console.log('PDF generated : ' + process.name + '.pdf')
}

export default GeneratePdf
