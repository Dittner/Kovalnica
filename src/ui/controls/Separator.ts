import { spacer } from "flinker-dom"
import { theme } from "../theme/ThemeManager"


export const HSeparator = () => {
  return spacer()
    .react(s => {
      s.width = '100%'
      s.height = '1px'
      s.bgColor = theme().text + '44'
    })
}
