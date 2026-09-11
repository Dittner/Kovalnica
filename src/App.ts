import { hlist, hstack, observer, p, spacer, vstack } from "flinker-dom"
import { GlobalContext } from "./app/GlobalContext"
import { FontFamily } from "./ui/controls/Font"
import { darkTheme, theme, themeManager } from "./ui/theme/ThemeManager"
import { AboutView } from "./ui/view/about/AboutView"
import { Icon, Link } from "./ui/controls/Button"
import { MaterialIcon } from "./ui/icons/MaterialIcon"
import { log } from "./app/Logger"
import { ViewLayer } from "./app/ViewLayer"
import { layout } from "./app/Application"
import { PageUid } from "./app/URLNavigator"
import { ContactsView } from "./ui/view/contacts/ContactsView"
import { PageNotFoundView } from "./ui/view/pageNotFound/PageNotFoundView"
import { GalleryView } from "./ui/view/gallery/GalleryView"
import { HSeparator } from "./ui/controls/Separator"

export const globalContext = GlobalContext.init()

export function App() {
  log('new App')

  return vstack()
    .observe(themeManager.$theme, 'affectsProps', 'affectsChildrenProps')
    .observe(globalContext.app.$layout, 'affectsProps', 'affectsChildrenProps')
    .react(s => {
      s.className = theme().id
      s.width = '100vw'
    })
    .children(() => {
      if (layout().isMobile)
        NavBarMobile()
      else
        NavBar()

      observer(globalContext.$activeVM)
        .onReceive(vm => {
          if (!vm) return undefined
          if (vm.id === 'about') return AboutView()
          else if (vm.id === 'gallery') return GalleryView()
          else if (vm.id === 'contacts') return ContactsView()
          else return PageNotFoundView()
        })

      //ModalView()
      AppFooter()
    })
    //.onClick(() => globalContext.app.$dropdownState.value = '')
}


export const Logo = () => {
  return Link()
    .react(s => {
      s.fontSize = '2.5rem'
      s.fontFamily = FontFamily.HERMANN
      s.textColor = theme().text
      s.text = 'K'
      s.href = '/'
      s.whiteSpace = 'nowrap'
      s.textDecoration = 'none'
    })
    .whenHovered(s => {
      s.textColor = theme().header
      s.textDecoration = 'none'
    })
    .onClick((e) => {
      e.preventDefault()
      globalContext.navigator.navigateTo('/')
    })
}

export const NavBarMobile = () => {
  return hstack()
    .react(s => {
      const l = layout()
      s.position = 'sticky'
      s.top = '0'
      s.width = '100%'
      s.height = l.navBarHeight + 'px'
      s.halign = 'left'
      s.valign = 'center'
      s.textColor = theme().text
      s.bgColor = theme().navBarBg
      s.layer = ViewLayer.TWO
      s.paddingHorizontal = l.contentLeftOffset + l.paddingHorizontal + 'px'
    })
    .children(() => {

      hlist<PageUid>()
        .observe(globalContext.navigator.$activePage, 'affectsChildrenProps')
        .items(() => globalContext.navigator.allPagesUid)
        .itemRenderer(PageUidRenderer)
        .itemHash((item: PageUid) => item + ':' + (item === globalContext.navigator.$activePage.value.uid))
        .react(s => {
          const l = layout()
          s.height = '100%'
          s.valign = 'center'
          s.halign = 'center'
          s.fontFamily = FontFamily.VERDANA
          s.fontSize = theme().fontSizeXS
          s.gap = '20px'
          //s.paddingVertical = '20px'
        })

      spacer()
      ThemeSwitcher()
    })
}

export const NavBar = () => {
  return hstack()
    .react(s => {
      const l = layout()
      s.position = 'sticky'
      s.top = '0'
      s.width = '100%'
      s.height = l.navBarHeight + 'px'
      s.halign = 'center'
      s.valign = 'center'
      s.textColor = theme().text
      s.bgColor = theme().navBarBg
      s.layer = ViewLayer.TWO
      s.paddingHorizontal = l.contentLeftOffset + l.paddingHorizontal + 'px'
    })
    .children(() => {
      Logo()

      spacer()

      hlist<PageUid>()
        .observe(globalContext.navigator.$activePage, 'affectsChildrenProps')
        .items(() => globalContext.navigator.allPagesUid)
        .itemRenderer(PageUidRenderer)
        .itemHash((item: PageUid) => item + ':' + (item === globalContext.navigator.$activePage.value.uid))
        .react(s => {
          s.height = '100%'
          s.valign = 'center'
          s.fontFamily = FontFamily.VERDANA
          s.fontSize = theme().fontSizeXS
          s.gap = '40px'
          //s.paddingVertical = '20px'
        })

      spacer()

      ThemeSwitcher()
    })
}

const pageUidToName = (uid: PageUid): string => {
  switch (uid) {
    case 'about': return 'О нас'
    case 'gallery': return 'Галерея'
    case 'contacts': return 'Контакты'
    default: return uid
  }
}

const PageUidRenderer = (uid: PageUid) => {
  return Link()
    .react(s => {
      const isSelected = globalContext.navigator.$activePage.value.uid === uid
      s.wrap = false
      s.isSelected = isSelected
      s.textAlign = 'left'
      //s.width = '100%'
      s.paddingVertical = '10px'
      s.paddingHorizontal = '10px'
      s.fontSize = theme().fontSizeS
      s.fontFamily = FontFamily.VERDANA
      s.fontWeight = 'bold'
      s.textColor = theme().text
      s.text = pageUidToName(uid)
      s.borderBottom = '4px solid ' + theme().transparent
      s.href = '/' + uid
      s.whiteSpace = 'nowrap'
      s.textDecoration = 'none'
    })
    .whenHovered(s => {
      s.textColor = theme().header
      s.textDecoration = 'none'
    })
    .whenSelected(s => {
      s.textColor = theme().menuSelected
      s.borderBottom = '4px solid ' + theme().menuSelected
      s.textDecoration = 'none'
    })
    .onClick((e) => {
      e.preventDefault()
      globalContext.navigator.navigateTo('/' + uid)
    })
}


export const ThemeSwitcher = () => {
  return hstack()
    .react(s => {
      s.height = '25px'
      s.cornerRadius = '4px'
      s.paddingHorizontal = '10px'
      s.valign = 'center'
      s.gap = '2px'
      s.border = '1px solid ' + theme().text + '44'
      s.popUp = 'Сменить тему'
      s.layer = '10'
    })
    .whenHovered(s => {
      s.bgColor = theme().text + '22'
      s.cursor = 'pointer'
    })
    .onClick(() => {
      themeManager.toggleTheme()
    })
    .children(() => {
      // Icon().react(s => {
      //   s.value = MaterialIcon.sunny
      //   s.fontSize = theme().fontSizeXS
      //   s.textAlign = 'center'
      //   s.textColor = theme().id === 'light' ? theme().text : 'inherit'
      // })

      // spacer()

      Icon().react(s => {
        s.value = theme().id === 'light' ? MaterialIcon.light_mode : MaterialIcon.mode_night
        s.fontSize = theme().fontSizeS
        s.textAlign = 'center'
        s.textColor = theme().text
      })

    })

}

export const ContactsPanel = () => {
  return vstack()
    .react(s => {
      s.halign = 'center'
      s.valign = 'center'
      s.textColor = theme().text
      s.gap = '0px'
      s.fontSize = theme().fontSizeXS
      s.padding = '20px'
      //s.bgColor = theme().appBg
      s.width = 'undefined'
      s.layer = '100'
    })
    .children(() => {
      ['«КОВАЛЬНИЦА»', 'г. Воронеж', ' +7 (950) 773-19-83', '(Александр Ковка)'].forEach(value => {
        p()
          .react(s => {
            s.text = value
            s.marginTop = '-2px'
          })
      })
    })
}

export const AppFooter = () => {
  return vstack()
    .react(s => {
      s.width = '100%'
      s.height = layout().footerHeight + 'px'
      s.halign = 'center'
      s.valign = 'center'
      s.bgColor = darkTheme().appBg
      s.paddingVertical = '20px'
      s.gap = '5px'
    }).children(() => {
      HSeparator().react(s => {
        s.width = layout().contentWidth - 2*layout().paddingHorizontal + 'px'
      })

      ContactsPanel()

      p().react(s => {
        s.fontFamily = FontFamily.APP
        s.fontSize = theme().fontSizeXS
        s.textColor = darkTheme().text50
        s.text = '© 2026, все права защищены'
      })
    })
}

