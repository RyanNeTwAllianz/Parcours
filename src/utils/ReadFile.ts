import path from 'path'
import { readFile } from 'fs/promises'
import type { ProcessType } from '../types.js'

const ReadFile = async (p: string): Promise<ProcessType> => {
    const fullPath = path.resolve('./const/' + p + '.json')

    const data = await readFile(fullPath, 'utf8')
    return JSON.parse(data) as ProcessType
}

export default ReadFile
