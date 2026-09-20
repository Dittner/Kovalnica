import { h1, hstack, p, spacer, span, vstack } from "flinker-dom"
import { FontFamily } from "../../controls/Font"
import { darkTheme, theme } from "../../theme/ThemeManager"
import { Markdown } from "../../controls/Markdown"
import { layout } from "../../../app/Application"
import { globalContext } from "../../../App"
import { Icon } from "../../controls/Button"
import { MaterialIcon } from "../../icons/MaterialIcon"
import { FittedImage } from "../../controls/Image"


export const AboutView = () => {
  const vm = globalContext.vmFactory.getHomeVM()
  return vstack()
    .react(s => {
      s.width = '100%'
      s.halign = 'center'
      s.valign = 'top'
      s.bgColor = theme().appBg
    })
    .children(() => {
      Header()
        .react(s => {
          const l = layout()
          s.paddingHorizontal = l.contentLeftOffset + 'px'
          s.width = '100%'
          s.height = window.innerHeight - l.navBarHeight + 'px'
          s.halign = 'center'
          s.valign = 'center'
          s.bgColor = darkTheme().appBg
          s.gap = '0'
        })

      Markdown()
        .observe(vm.$content)
        .react(s => {
          //s.position = 'relative'
          //s.left = layout().contentLeftOffset + 'px'
          //s.top = '400px'
          s.className = theme().id
          s.paddingTop = '50px'
          s.mode = 'md'
          s.fontSize = theme().fontSize
          s.fontFamily = FontFamily.VERDANA
          s.textColor = theme().text
          s.width = layout().contentWidth + 'px'
          //s.maxWidth = '800px'
          //s.bgColor = '#00000088'
          s.textAlign = 'left'
          s.text = vm.$content.value
          s.paddingHorizontal = layout().paddingHorizontal + 'px'
        })

    })
}

export const Header = () => {
  return vstack()
    .children(() => {
      FittedImage()
        .react(s => {
          s.src = '/resources/assets/app_bg.jpg'
          s.canvasWidth = Math.min(1920, layout().windowWidth)
          s.canvasHeight = window.innerHeight / 2 - 50
          s.fitTo = layout().isPortraitOrientation ? 'canvasHeight' : 'canvasWidth'
        })

      spacer()

      h1().react(s => {
        s.textColor = darkTheme().header
        s.text = '«КОВАЛЬНИЦА»'
      })

      p().react(s => {
        s.fontFamily = FontFamily.HANDSCHRIFT
        s.fontSize = '2.5rem'
        s.text = 'Художественная'
        s.textColor = darkTheme().text
      })

      p().react(s => {
        s.fontFamily = FontFamily.HANDSCHRIFT
        s.fontSize = '1.8rem'
        s.text = 'ковка'
        s.textColor = darkTheme().text
        s.marginTop = '-30px'
      })

      Contacts()

      spacer()
    })
}


const Contacts = () => {
  return hstack()
    .react(s => {
      const l = layout()
      s.halign = 'center'
      s.valign = 'bottom'
      s.padding = '5px'
      s.width = 'unset'
      s.textColor = darkTheme().orange
      s.fontSize = darkTheme().fontSizeXS
      s.paddingTop = '100px'
    })
    .children(() => {
      Icon().react(s => {
        s.value = MaterialIcon.place
      })
      span()
        .react(s => {
          s.text = 'г. Воронеж,'
          s.marginRight = '5px'
        })

      Icon().react(s => {
        s.value = MaterialIcon.call
      })
      span()
        .react(s => {
          s.text = '+7 (950) 773-19-83'
        })
    })
}
