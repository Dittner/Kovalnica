import { p, spacer } from "flinker-dom"
import { theme } from "../theme/ThemeManager"
import { FontFamily } from "./Font"


export const Title = (value: string) => {
  return p()
    .react(s => {
      s.textColor = theme().text
      s.fontFamily = FontFamily.APP
      s.fontSize = theme().fontSizeXS
      s.fontWeight = 'bold'
    })
}


export const VSeparator = () => {
  return spacer().react(s => {
    s.bgColor = theme().border
    s.width = '1px'
    s.height = '15px'
  })
}