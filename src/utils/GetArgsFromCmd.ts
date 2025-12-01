import minimist from 'minimist'

const GetArgsFromCmd = (): { file: string } => {
    const args = minimist(process.argv.slice(2))
    return { file: args._[0] ?? 'auto' }
}

export default GetArgsFromCmd
