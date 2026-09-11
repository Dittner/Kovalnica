import { RXObservableValue } from 'flinker'
import { buildRule, FontWeight, UIComponentProps } from 'flinker-dom'
import { FontFamily } from '../controls/Font'

type THEME_ID = 'light' | 'dark'

export interface GlobalTheme {
  id: THEME_ID
  isLight: boolean
  fontSizeXL: string
  fontSizeL: string
  fontSizeM: string
  fontSize: string
  defFontSize: string
  fontSizeS: string
  fontSizeXS: string
  defFontWeight: FontWeight
  header: string
  accent: string
  text: string
  text50: string
  caretColor: string
  em: string
  quote: string
  blue: string
  black: string
  white: string
  mark: string
  menuSelected: string
  red: string
  border: string
  appBg: string
  navBarBg: string
  transparent: string
}

export class ThemeManager {
  readonly lightTheme: GlobalTheme
  readonly darkTheme: GlobalTheme

  readonly $theme: RXObservableValue<GlobalTheme>

  setLightTheme() {
    this.$theme.value = this.lightTheme
    const html = document.querySelector('html')
    if (html) {
      html.style.colorScheme = 'dark'
      html.style.backgroundColor = this.$theme.value.appBg
    }
    window.localStorage.setItem('theme', 'light')
  }

  setDarkTheme() {
    this.$theme.value = this.darkTheme
    const html = document.querySelector('html')
    if (html) {
      html.style.colorScheme = 'dark'
      html.style.backgroundColor = this.$theme.value.appBg
    }
    window.localStorage.setItem('theme', 'dark')
  }

  toggleTheme() {
    if (this.$theme.value.id === 'light')
      this.setDarkTheme()
    else
      this.setLightTheme()
  }

  constructor() {
    this.lightTheme = this.createLightTheme()
    this.darkTheme = this.createDarkTheme(this.lightTheme)
    this.$theme = new RXObservableValue(this.darkTheme)

    this.buildThemeSelectors(this.lightTheme)
    this.buildThemeSelectors(this.darkTheme)

    const theme = window.localStorage.getItem('theme') ?? 'dark'
    if (theme === 'light') {
      this.$theme = new RXObservableValue(this.lightTheme)
      this.setLightTheme()
    } else if (theme === 'dark') {
      this.$theme = new RXObservableValue(this.darkTheme)
      this.setDarkTheme()
    }
  }


  /*
  *
  * LIGHT THEME
  *
  * */


  createLightTheme(): GlobalTheme {
    const red = '#a00237'
    const black = '#1f2226' //121416
    const accent = red  //b8c892 c693c3
    const text = '#111111' //707786
    const white = '#ffFFff'
    const res = {
      id: 'light',
      isLight: true,

      fontSizeXL: '2.5rem',
      fontSizeL: '2rem',
      fontSizeM: '1.8rem',
      fontSize: '1rem',
      defFontSize: 'inherit',
      fontSizeS: '0.85rem',
      fontSizeXS: '0.7rem',

      defFontWeight: 'normal',

      appBg: '#fafbfb',
      navBarBg: '#ffFFff', //304041

      accent,
      header: '#444444',
      text,
      text50: text + 'bb',

      red,
      em: '#533a61',
      quote: '#1f5a72',
      black,
      white,
      mark: '#b21d29',
      menuSelected: accent,
      blue: '#005b90',
      border: '#b6c4cf',
      transparent: '#00000000',
    } as GlobalTheme

    return res
  }


  /*
  *
  * DARK THEME
  *
  * */

  createDarkTheme(t: GlobalTheme): GlobalTheme {
    const red = '#ae3e5e' //b9777d
    const black = '#0c0d0f' //121416
    const white = '#c1c6d2'
    const accent = '#ba566c'  //b8c892 c693c3
    const text = '#8f97aa' //707786
    const appBg = black
    const res = Object.assign({}, t, {
      id: 'dark',
      isLight: false,
      appBg,
      navBarBg: '#18191c',

      accent,
      header: white,
      text,
      text50: text + 'bb',

      red,
      em: white,
      quote: '#698897', //6a87a0 
      black,
      white,
      mark: '#dd7d85',
      menuSelected: white,
      blue: '#225581',
      border: '#2d3338',
    }) as GlobalTheme

    return res
  }


  readonly alreadyBuiltTheme: Record<string, boolean> = {}

  buildThemeSelectors(t: GlobalTheme) {
    if (this.alreadyBuiltTheme[t.id]) return
    this.alreadyBuiltTheme[t.id] = true

    const parentSelector = t.id
    const monoFont = 'var(--font-family-mono)'
    const textColor = t.text
    const headerPadingTop = '0px'
    // const textProps: StylableComponentProps = { textColor: '#86b3c7' }
    // buildRule(textProps, theme.id, '*')

    /******************************/
    // header
    /******************************/

    const h1Props: UIComponentProps = {
      //textTransform: 'uppercase',
      fontFamily: FontFamily.APP,
      fontSize: t.fontSizeXL,
      fontWeight: 'bold',
      letterSpacing: '-2.0px',
      textColor: t.header,
      paddingTop: headerPadingTop,
      //paddingBottom: '20px'
    }
    buildRule(h1Props, parentSelector, 'h1')

    const h2Props: UIComponentProps = {
      fontFamily: FontFamily.APP,
      fontSize: t.fontSizeL,
      letterSpacing: '-2.0px',
      fontWeight: 'bold',
      textColor: t.header,
      paddingTop: headerPadingTop,
    }
    buildRule(h2Props, parentSelector, 'h2')

    const h3Props: UIComponentProps = {
      fontFamily: FontFamily.APP,
      fontSize: t.fontSizeM,
      letterSpacing: '-2.0px',
      fontWeight: 'bold',
      textAlign: 'left',
      textColor: t.header,
      paddingTop: headerPadingTop
    }
    buildRule(h3Props, parentSelector, 'h3')

    const h4Props: UIComponentProps = {
      fontFamily: FontFamily.APP,
      fontSize: t.fontSizeM,
      fontWeight: 'bold',
      textAlign: 'left',
      textColor: t.header,
      borderBottom: '1px solid ' + t.header
    }
    buildRule(h4Props, parentSelector, 'h4')

    const h5Props: UIComponentProps = {
      fontFamily: FontFamily.APP,
      fontSize: t.defFontSize,
      fontWeight: 'bold',
      textColor: t.header
    }
    buildRule(h5Props, parentSelector, 'h5')

    const h6Props: UIComponentProps = {
      fontFamily: FontFamily.APP,
      fontSize: t.defFontSize,
      fontWeight: t.defFontWeight,
      textColor: t.header
    }
    buildRule(h6Props, parentSelector, 'h6')

    /******************************/
    // div, p, span
    /******************************/

    const globalProps: UIComponentProps = {
      fontFamily: 'inherit',
      fontSize: t.defFontSize,
      fontWeight: t.defFontWeight,
      textColor: 'inherit',
    }
    buildRule(globalProps, parentSelector, 'div')
    buildRule(globalProps, parentSelector, 'p')
    buildRule(globalProps, parentSelector, 'span')

    /******************************/
    // strong, b, i
    /******************************/

    const strongProps: UIComponentProps = {
      //fontFamily: '--font-family-article-bi',
      fontSize: 'inherit',
      textColor: t.text,
      fontWeight: t.isLight ? 'bold' : 'inherit',
      fontStyle: 'inherit'
    }

    buildRule(strongProps, parentSelector, 'strong')
    strongProps.width = '100%'
    strongProps.textColor = '#ff0000'
    buildRule(strongProps, parentSelector, 'div.de')
    buildRule(strongProps, parentSelector, 'div.en')

    const boldProps: UIComponentProps = {
      fontSize: 'inherit',
      textColor: 'inherit',
      fontWeight: 'bold'
    }
    buildRule(boldProps, parentSelector, 'b')

    const italicProps: UIComponentProps = {
      fontSize: 'inherit',
      textColor: 'inherit',
      fontWeight: 'inherit',
      fontStyle: 'italic'
    }
    buildRule(italicProps, parentSelector, 'i')

    /******************************/
    // list
    /******************************/

    const listItemProps: UIComponentProps = {
      fontSize: t.defFontSize,
      fontWeight: t.defFontWeight,
      textColor: 'inherit',
      margin: '0px',
      padding: '0px',
      marginLeft: '20px'
    }
    buildRule(listItemProps, parentSelector, 'li')
    buildRule(listItemProps, parentSelector, 'ol')

    const listProps: UIComponentProps = {
      fontSize: 'inherit',
      fontWeight: t.defFontWeight,
      textColor: 'inherit',
      margin: '0px',
      marginLeft: '20px',
      padding: '0px',
    }
    buildRule(listProps, parentSelector, 'ul')

    /******************************/
    // table
    /******************************/

    const tableProps: UIComponentProps = {
      width: '100%',
      fontSize: t.fontSizeS,
      textColor: 'inherit',
      fontWeight: t.defFontWeight,
      borderColor: t.border,
    }
    buildRule(tableProps, parentSelector, 'table')

    const tdProps: UIComponentProps = {
      fontSize: 'inherit',
      textColor: 'inherit',
      fontWeight: 'inherit',
      borderColor: t.border,
      padding: '10px'
    }

    buildRule(tdProps, parentSelector, 'th')
    buildRule(tdProps, parentSelector, 'td')

    /******************************/
    // em `
    /******************************/

    const emphasizeProps: UIComponentProps = {
      //bgColor: t.id === 'light-md' ? '#bbd5bfff' : 'undefined',
      textColor: t.em,
      fontStyle: 'normal',
      //bgImage: t.isLight ? 'linear-gradient(#4ed0ad00, #4ed0ad50)' : 'inherit',
      //paddingVertical: '5px'
    }
    buildRule(emphasizeProps, parentSelector, 'em')

    /******************************/
    // mark
    /******************************/

    const markProps: UIComponentProps = {
      fontSize: 'inherit',
      fontWeight: 'inherit',
      textColor: t.mark,
      bgColor: 'unset'
      //bgImage: t.id === 'light-md' ? `linear-gradient(${t.mark + '00'}, ${t.mark + '50'})` : 'inherit',
    }

    buildRule(markProps, parentSelector, 'mark')

    /******************************/
    // code ``
    /******************************/

    const monoFontProps: UIComponentProps = {
      fontSize: t.fontSizeS,
      fontFamily: monoFont,
      display: 'inline',
      textColor: 'inherit',
      padding: '2px',
      whiteSpace: 'nowrap'
      //padding: '5px'
    }
    buildRule(monoFontProps, parentSelector, 'code')

    /******************************/
    // link
    /******************************/

    const linkProps: UIComponentProps = {
      fontSize: 'inherit',
      fontWeight: t.defFontWeight,
      textColor: t.blue
    }

    buildRule(linkProps, parentSelector, 'a')
    buildRule(linkProps, parentSelector, 'a:link')
    buildRule(linkProps, parentSelector, 'a:visited')
    buildRule(linkProps, parentSelector, 'a:active')
    linkProps.textDecoration = 'underline'
    buildRule(linkProps, parentSelector, 'a', ':hover')

    /******************************/
    // quote
    /******************************/

    const blockquoteProps: UIComponentProps = {
      width: '100%',
      paddingHorizontal: '20px',
      fontSize: 'inherit',
      textColor: t.quote,
      borderLeft: '1px solid ' + t.quote + '88',
    }
    buildRule(blockquoteProps, parentSelector, 'blockquote')

    const blockquoteContentProps: UIComponentProps = {
      width: '100%',
      paddingHorizontal: '20px',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      textColor: 'inherit',
      //fontStyle: 'italic'
    }

    buildRule(blockquoteContentProps, parentSelector, 'blockquote p')
    blockquoteContentProps.fontWeight = 'bold'
    blockquoteContentProps.textAlign = 'right'
    blockquoteContentProps.paddingVertical = '10px'
    buildRule(blockquoteContentProps, parentSelector, 'blockquote footer')

    /******************************/
    // image
    /******************************/

    const imgProps: UIComponentProps = {
      maxWidth: Math.min(800, window.screen.width - 40) + 'px',
      //paddingTop: '50px'
    }
    buildRule(imgProps, parentSelector, 'img')
    buildRule(imgProps, parentSelector, 'figure')

    /******************************/
    // audio
    /******************************/

    const audioProps: UIComponentProps = {
      width: '50%',
      height: '35px',
      display: 'block',
    }
    buildRule(audioProps, parentSelector, 'audio')

    const audioControlsProps: UIComponentProps = {
      textColor: t.red,
      bgColor: t.border
    }
    buildRule(audioControlsProps, parentSelector, 'audio::-webkit-media-controls-panel')

    /******************************/
    // figcaption
    /******************************/

    const imgCaptionProps: UIComponentProps = {
      fontWeight: 'inherit',
      fontSize: t.fontSizeXS,
      textColor: t.text50,
      paddingBottom: '5px'
    }
    buildRule(imgCaptionProps, parentSelector, 'figcaption')

    /******************************/
    // stars delim
    /******************************/

    const delimProps: UIComponentProps = {
      width: '100%',
      fontWeight: 'bold',
      paddingVertical: '0px',
      textAlign: 'center'
    }
    buildRule(delimProps, parentSelector, '.md-delim')

    const materialIconProps: UIComponentProps = {
      className: '.md-icon',
      fontFamily: FontFamily.MATERIAL_ICON,
      fontSize: 'inherit',
    }
    buildRule(materialIconProps, parentSelector, '.md-icon')

    /******************************/
    // hr
    /******************************/

    const hrProps: UIComponentProps = {
      width: '100%',
      height: '1px',
      border: '1px solid ' + t.border,
      //marginBottom: '20px',
    }
    buildRule(hrProps, parentSelector, 'hr')

    /******************************/
    // footer
    /******************************/

    const footerProps: UIComponentProps = {
      width: '100%',
      textColor: t.text50,
      fontSize: t.fontSizeXS,
    }
    buildRule(footerProps, parentSelector, 'footer')

    /******************************/
    // alignment
    /******************************/

    const centerAlignmentProps: UIComponentProps = {
      width: '100%',
      textAlign: 'center',
      fontWeight: 'inherit',
      fontSize: 'inherit',
      textColor: 'inherit'
    }
    buildRule(centerAlignmentProps, parentSelector, 'p.md-center')

    const rightAlginmentProps: UIComponentProps = {
      width: '100%',
      textAlign: 'right',
      fontWeight: 'inherit',
      fontSize: 'inherit',
      textColor: 'inherit'
    }
    buildRule(rightAlginmentProps, parentSelector, 'p.md-right')

    // custom rule
    const centerAllProps: any = {
      width: '100%',
      fontSize: 'inherit',
      flexDirection: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontWeight: 'inherit',
      textColor: 'inherit'
    }
    buildRule(centerAllProps, parentSelector, 'div.center')

    /******************************/
    // poem
    /******************************/

    const poemProps: any = {
      textColor: 'inherit',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: '50px',
      fontSize: t.fontSizeS
    }
    buildRule(poemProps, parentSelector, 'div.poem')
    buildRule({ fontSize: 'inherit', textColor: 'inherit' }, parentSelector, 'div.poem div')

  }
}

export const themeManager = new ThemeManager()
export const theme = () => themeManager.$theme.value
export const lightTheme = () => themeManager.lightTheme
export const darkTheme = () => themeManager.darkTheme