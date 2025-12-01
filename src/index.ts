import GetArgsFromCmd from './utils/GetArgsFromCmd.js'
import Init from './utils/Init.js'
import End from './utils/End.js'
import ReadFile from './utils/ReadFile.js'
import ParcourForm from './utils/ParcourForm.js'
import CreateFile from './utils/CreateFile.js'
import GeneratePdf from './utils/GeneratePdf.js'
import CreateFolder from './utils/GenerateFolder.js'
import RefactoParcours from './utils/RefactoParcours.js'
import GenerateHTML from './utils/GenerateHTML.js'

const Main = async () => {
    const { file } = GetArgsFromCmd()

    const process = await ReadFile(file)
    CreateFolder('./screenshots/' + process.name)

    process.url = process.url + (process.tests[0]?.commands[0]?.target ?? '')
    const { browser, page } = await Init({ process })

    const parcours = await ParcourForm({ page, process })

    await CreateFile({ parcours, process })
    await GeneratePdf({ parcours, page, process })
    await End({ browser })

    const refactoParcours = RefactoParcours(parcours)
    await GenerateHTML({ data: refactoParcours, process })
}

await Main()

export default Main
