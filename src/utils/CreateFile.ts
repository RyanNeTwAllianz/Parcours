import { writeFile } from 'fs/promises'

type IProps = {
    array: any[]
    fileName: string
}

const CreateFile = async ({ array, fileName }: IProps): Promise<void> => {
    if (!array.length) return

    await writeFile(fileName, JSON.stringify(array), 'utf-8')
    console.log('File created => ' + fileName)
}

export default CreateFile
