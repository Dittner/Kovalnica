import { h1, image, p, spacer, vstack } from "flinker-dom"
import { FontFamily } from "../../controls/Font"
import { darkTheme, theme } from "../../theme/ThemeManager"
import { Markdown } from "../../controls/Markdown"
import { layout } from "../../../app/Application"
import { globalContext } from "../../../App"


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
          //s.position = 'relative'
          s.paddingHorizontal = l.contentLeftOffset + 'px'

          //s.top = '0'
          s.width = '100%'
          //s.paddingTop = '50px'
          //s.top = l.appHeaderHeight + 'px'
          //s.height = l.appHeaderHeight + 'px'
          s.height = window.innerHeight - l.navBarHeight + 'px'
          s.halign = 'center'
          s.valign = 'center'
          //s.paddingBottom = layout().statusBarHeight + 'px'
          s.bgColor = darkTheme().appBg
          //s.layer = ViewLayer.TWO
          s.gap = '0'
          //s.paddingHorizontal = '20px'
          s.overflow = 'clip'
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
          //s.maxWidth = '700px'
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
      image()
        .react(s => {
          s.top = '0'
          s.src = 'resources/assets/app_bg.jpg'
          const hei = Math.min(600, window.innerHeight / 2 - 50)
          s.height = hei + 'px'
          s.maxWidth = 'unset'
          s.width = 'auto'
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

      spacer()

    })
}