import { p, vstack } from "flinker-dom"
import { FontFamily } from "../../controls/Font"
import { theme } from "../../theme/ThemeManager"
import { layout } from "../../../app/Application"
import { MaterialIcon } from "../../icons/MaterialIcon"
import { Icon } from "../../controls/Button"

export const PageNotFoundView = () => {
  return vstack()
    .react(s => {
      s.width = '100%'
      s.halign = 'center'
      s.valign = 'center'
      s.bgColor = theme().appBg
      s.minHeight = window.innerHeight - layout().navBarHeight - layout().footerHeight + 'px'
    })
    .children(() => {

      Icon().react(s => {
        s.value = MaterialIcon.report_problem
        s.fontSize = '3rem'
        s.textColor = theme().text50
      })

      p().react(s => {
        s.fontSize = theme().fontSize
        s.fontFamily = FontFamily.VERDANA
        s.textColor = theme().text
        s.text = 'Страница не найдена'
      })
    })
}

