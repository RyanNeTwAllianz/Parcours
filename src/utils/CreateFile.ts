import { writeFile } from 'fs/promises'
import type { Parcours, ProcessType } from '../types.js'

type IProps = {
    parcours: Parcours[]
    process: ProcessType
}

const CreateFile = async ({ parcours, process }: IProps) => {
    const fileName = './output/' + process.name + '.json'
    await writeFile(fileName, JSON.stringify(parcours), 'utf-8')

    console.log('File created => ' + fileName)
}

export default CreateFile
