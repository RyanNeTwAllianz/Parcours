import { mkdirSync, existsSync } from 'node:fs'

const CreateFolder = (path: string) => {
    if (existsSync(path)) return

    mkdirSync(`${path}`)
    console.log(`Folder created: ${path}`)
}
export default CreateFolder
