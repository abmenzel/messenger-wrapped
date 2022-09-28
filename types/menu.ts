import { Stage } from "./stages"

type menuItemLink = {
    type: 'link'
	label: string
    link: string
    visible: () => boolean
}
type menuItemStage = {
    type: 'function'
	label: string
    visible: () => boolean
    stage: Stage
}

type menuItem = menuItemLink | menuItemStage

export type { menuItem, menuItemLink, menuItemStage }
