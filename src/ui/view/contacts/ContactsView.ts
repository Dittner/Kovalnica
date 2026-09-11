import { vstack } from "flinker-dom"
import { FontFamily } from "../../controls/Font"
import { theme } from "../../theme/ThemeManager"
import { Markdown } from "../../controls/Markdown"
import { layout } from "../../../app/Application"
import { globalContext } from "../../../App"

export const ContactsView = () => {
  const vm = globalContext.vmFactory.getContactsVM()
  return vstack()
    .react(s => {
      s.width = '100%'
      s.halign = 'center'
      s.valign = 'top'
      s.paddingHorizontal = layout().contentLeftOffset + 'px'
      s.bgColor = theme().appBg
      s.position = 'relative'
      s.paddingVertical = '50px'
      s.minHeight = window.innerHeight - layout().navBarHeight - layout().footerHeight  + 'px'
    })
    .children(() => {

      Markdown()
        .observe(vm.$content)
        .react(s => {
          s.className = theme().id
          s.mode = 'md'
          s.fontSize = theme().fontSize
          s.fontFamily = FontFamily.VERDANA
          s.textColor = theme().text
          s.width = '100%'
          //s.maxWidth = '700px'
          //s.bgColor = '#00000088'
          s.textAlign = 'left'
          s.text = vm.$content.value
          s.paddingHorizontal = layout().paddingHorizontal + 'px'
        })

    })
}

