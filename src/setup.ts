import CreateFolder from './utils/GenerateFolder.js'

const Setup = async () => {
    CreateFolder('./const')
    CreateFolder('./output')
    CreateFolder('./screenshots')

    console.log('Setup done !')
}

await Setup()

export default Setup
