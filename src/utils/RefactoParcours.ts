import {
    Commands,
    ParcoursStepName,
    type Parcours,
    type RefacoParcours,
} from '../types.js'

const RefactoParcours = (parcours: Parcours[]): RefacoParcours[] => {
    parcours = parcours.filter(
        (p) => ![Commands.OPEN, Commands.SET_WINDOW_SIZE].includes(p.command)
    )

    const groupedParcours: Record<string, Parcours[]> = {}

    const seenUrls = new Set()

    for (let i = parcours.length - 1; i >= 0; i--) {
        const p = parcours[i]
        if (!p) continue

        if (!seenUrls.has(p.stepName)) {
            seenUrls.add(p.stepName)

            if (!groupedParcours[p.processName]) {
                groupedParcours[p.processName] = []
            }
            groupedParcours[p.processName]?.push(p)
        }
    }

    const refactoParcours: RefacoParcours[] = Object.entries(groupedParcours)
        .map(([processName, parcours]) => ({
            stepName: processName as ParcoursStepName,
            parcours: parcours.reverse(),
        }))
        .filter((parcours) => parcours.stepName)

    return refactoParcours
}

export default RefactoParcours
