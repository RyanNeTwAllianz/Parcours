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

    parcours.map((p) => {
        if (p.processName === ParcoursStepName.DEVIS_FQ)
            return refactoParcours[0] ? refactoParcours[0].parcours.push(p) : []

        if (p.processName === ParcoursStepName.DEVIS_PL)
            return refactoParcours[1] ? refactoParcours[1].parcours.push(p) : []
    })

    return refactoParcours
}

export default RefactoParcours
