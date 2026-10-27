import { RXObservableValue } from "flinker"
import { globalContext } from "../App"
import { Application, BrowserLocation, UpdateUrlMode } from "./Application"
import { delay } from "./Utils"
import { log, logErr, logWarn } from "./Logger"

export type PageUid = 'about' | 'gallery' | 'contacts' | 'newItems' | 'pageNotFound'

export interface IPage {
  readonly uid: PageUid
  path: string
  locationKeys: string[]
  locationParams: URLSearchParams
}

export interface IPageMatcher {
  readonly uid: PageUid
  match(locationPath: string, locationKeys: string[], locationParams: URLSearchParams): boolean
}


//---------------------------
// AboutPage
//---------------------------
export class AboutPageMatcher implements IPageMatcher {
  readonly uid = 'about'
  match(locationPath: string, locationKeys: string[], locationParams: URLSearchParams): boolean {
    return locationKeys.length === 0 || locationKeys[0] === 'about'
  }
}

//---------------------------
// GalleryPage
//---------------------------
export class GalleryPageMatcher implements IPageMatcher {
  readonly uid = 'gallery'
  match(locationPath: string, locationKeys: string[], locationParams: URLSearchParams): boolean {
    return locationKeys.length > 0 && locationKeys[0] === 'gallery'
  }
}

//---------------------------
// ContactsPage
//---------------------------
export class ContactsPageMatcher implements IPageMatcher {
  readonly uid = 'contacts'
  match(locationPath: string, locationKeys: string[], locationParams: URLSearchParams): boolean {
    return locationKeys.length > 0 && locationKeys[0] === 'contacts'
  }
}

//---------------------------
// NewItemsPage
//---------------------------
export class NewItemsPageMatcher implements IPageMatcher {
  readonly uid = 'newItems'
  match(locationPath: string, locationKeys: string[], locationParams: URLSearchParams): boolean {
    return locationKeys.length > 0 && locationKeys[0] === 'newItems'
  }
}

//---------------------------
// PageNotFound
//---------------------------
export class PageNotFoundMatcher implements IPageMatcher {
  readonly uid = 'pageNotFound'
  match(locationPath: string, locationKeys: string[], locationParams: URLSearchParams): boolean {
    return true
  }
}


export class URLNavigator {
  readonly allPagesUid: PageUid[] = ['about', 'gallery', 'contacts', 'newItems']
  readonly $activePage: RXObservableValue<IPage>
  readonly matchers: IPageMatcher[]

  constructor(app: Application) {
    this.matchers = [
      new AboutPageMatcher(),
      new GalleryPageMatcher(),
      new ContactsPageMatcher(),
      new NewItemsPageMatcher(),
      new PageNotFoundMatcher()
    ]
    this.$activePage = new RXObservableValue<IPage>({ uid: 'about', path: '', locationKeys: [], locationParams: new URLSearchParams() })

    app.$location.pipe()
      .onReceive(location => {
        log('URLNavigator: received new location')
        this.locationDidChange(location)
      })
      .subscribe()
  }

  private locationDidChange(location: BrowserLocation) {
    const locationPath = location.path.startsWith('/') ? location.path.slice(1) : location.path
    const locationKeys = locationPath.split('/').filter(v => v !== '')
    const locationParams = new URLSearchParams(location.queries)

    for (const m of this.matchers) {
      if (m.match(locationPath, locationKeys, locationParams)) {
        this.$activePage.value = { uid: m.uid, path: locationPath, locationKeys, locationParams }
        return
      }
    }
    logWarn('URLNavigator::locationDidChange: No matched page template! Add PageNotFound to the end of the matchers.')
  }

  navigateTo(path: string, mode: UpdateUrlMode = 'push') {
    if (this.infiniteLoopDetected) return
    this.countNavRequests()
    globalContext.app.navigate(path, mode)
  }


  private counter = 0
  private infiniteLoopDetected = false
  private async countNavRequests() {
    if (this.counter < 50) {
      this.counter++
      if (this.counter === 1) {
        await delay(1000)
        this.counter = 0
      }
    } else {
      this.infiniteLoopDetected = true
      globalContext.app.$err.value = 'Infinite loop is detected'
      logErr('URLNavigator: Infinite loop is detected, activePage:', this.$activePage.value)
    }
  }
}