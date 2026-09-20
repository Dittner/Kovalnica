import { iframe, vstack } from "flinker-dom"
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
      s.halign = 'left'
      s.valign = 'top'
      s.paddingHorizontal = layout().contentLeftOffset + layout().paddingHorizontal + 'px'
      s.bgColor = theme().appBg
      s.paddingVertical = '20px'
      s.gap = '20px'
      s.minHeight = window.innerHeight - layout().navBarHeight - layout().footerHeight + 'px'
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
        })

      iframe()
        .react(s => {
          s.width = '100%'
          s.height = '500px'
          s.borderColor = '#00000000'
          s.src = "https://yandex.ru/map-widget/v1/?um=constructor%3Abc748e63056de0b21dd18b05c5277a8e19ba530ec821721c8df71b8ab2cae056&amp;source=constructor"
        })

    })
}
