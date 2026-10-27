import { image, vstack } from "flinker-dom"
import { theme } from "../../theme/ThemeManager"
import { layout } from "../../../app/Application"
import { globalContext } from "../../../App"

export const NewItemsView = () => {
  const vm = globalContext.vmFactory.getNewItemsVM()
  return vstack()
    .react(s => {
      s.width = '100%'
      s.halign = 'left'
      s.valign = 'top'
      //s.paddingLeft = layout().contentLeftOffset + 'px'
      s.paddingVertical = '20px'
      s.bgColor = theme().appBg
      s.halign = 'center'
      s.gap = '20px'
      s.minHeight = window.innerHeight - layout().navBarHeight - layout().footerHeight + 'px'
    })
    .children(() => {

      vm.photoLinks.forEach(path => {
        image()
          .react(s => {
            s.src = path
            s.loading = 'lazy'
            s.maxWidth = window.screen.availWidth + 'px'
            //s.maxHeight = window.innerHeight - 50 - layout().navBarHeight + 'px'
          })
      })
    })
}



