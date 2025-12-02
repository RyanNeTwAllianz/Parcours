import {
    Commands,
    ParcoursStepName,
    type Parcours,
    type RefacoParcours,
} from '../types.js'

const RefactoParcours = (parcours: Parcours[]): RefacoParcours[] => {
    let refactoParcours: RefacoParcours[] = [
        {
            stepName: ParcoursStepName.DEVIS_FQ,
            parcours: [],
        },
        {
            stepName: ParcoursStepName.DEVIS_PL,
            parcours: [],
        },
    ]

    parcours = parcours.filter(
        (p) => ![Commands.OPEN, Commands.SET_WINDOW_SIZE].includes(p.command)
    )

    const seenUrls = new Set()

    for (let i = parcours.length - 1; i >= 0; i--) {
        const p = parcours[i]
        if (!p) continue

        if (!seenUrls.has(p.stepName)) {
            seenUrls.add(p.stepName)

            if (p.processName === ParcoursStepName.DEVIS_FQ) {
                refactoParcours[0] && refactoParcours[0].parcours.push(p)
            } else if (p.processName === ParcoursStepName.DEVIS_PL) {
                refactoParcours[1] && refactoParcours[1].parcours.push(p)
            }
        }
    }

    refactoParcours.forEach((rp) => rp.parcours.reverse())

    return refactoParcours
}

export default RefactoParcours
