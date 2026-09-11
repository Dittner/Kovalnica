import { RXObservableValue } from "flinker"
import { Application } from "./Application"
import { KeyValueStore } from "./KeyValueStore"
import { URLNavigator } from "./URLNavigator"
import { generateUID } from "./Utils"
import { IViewModel } from "../ui/view/ViewModel"
import { log } from "./Logger"
import { AboutVM } from "../ui/view/about/AboutVM"
import { ContactsVM } from "../ui/view/contacts/ContactsVM"
import { GalleryVM } from "../ui/view/gallery/GalleryVM"
import { PageNotFoundVM } from "../ui/view/pageNotFound/PageNotFoundVM"

export interface Message {
  readonly level?: 'warning' | 'error' | 'info'
  readonly text: string
}

export class GlobalContext {
  readonly uid = generateUID()
  readonly app: Application
  readonly navigator: URLNavigator
  readonly localStorage: KeyValueStore

  static readonly PAGE_SIZE = 20
  readonly $activeVM = new RXObservableValue<IViewModel | undefined>(undefined)

  readonly $msg = new RXObservableValue<Message | undefined>(undefined)
  readonly router: Router
  readonly vmFactory: LazyVMFctory

  static self: GlobalContext

  static init() {
    if (GlobalContext.self === undefined) {
      GlobalContext.self = new GlobalContext()
    }
    return GlobalContext.self
  }

  private constructor() {
    log('new GlobalContext')

    this.app = new Application()
    this.localStorage = new KeyValueStore('kovalnicaLocalStore')
    this.navigator = new URLNavigator(this.app)

    this.vmFactory = new LazyVMFctory(this)
    this.router = new Router(this)

  }
}


export class LazyVMFctory {
  private ctx: GlobalContext
  constructor(ctx: GlobalContext) {
    this.ctx = ctx
  }

  private _homeVM?: AboutVM
  getHomeVM(): AboutVM {
    if (!this._homeVM) this._homeVM = new AboutVM(this.ctx)
    return this._homeVM
  }

  private _galleryVM?: GalleryVM
  getGalleryVM(): GalleryVM {
    if (!this._galleryVM) this._galleryVM = new GalleryVM(this.ctx)
    return this._galleryVM
  }


  private _contactsVM?: ContactsVM
  getContactsVM(): ContactsVM {
    if (!this._contactsVM) this._contactsVM = new ContactsVM(this.ctx)
    return this._contactsVM
  }

  private _pageNotFoundVM?: PageNotFoundVM
  getPageNotFoundVM(): PageNotFoundVM {
    if (!this._pageNotFoundVM) this._pageNotFoundVM = new PageNotFoundVM(this.ctx)
    return this._pageNotFoundVM
  }
}

export class Router {
  constructor(ctx: GlobalContext) {
    ctx.navigator.$activePage.pipe()
      .debounce(10)
      .onReceive(page => {
        let newVM: IViewModel
        if (page.uid === 'about')
          newVM = ctx.vmFactory.getHomeVM()
        else if (page.uid === 'gallery')
          newVM = ctx.vmFactory.getGalleryVM()
        else if (page.uid === 'contacts')
          newVM = ctx.vmFactory.getContactsVM()
        else
          newVM = ctx.vmFactory.getPageNotFoundVM()

        if (ctx.$activeVM.value !== newVM) {
          ctx.$activeVM.value?.deactivate()
          ctx.$activeVM.value = newVM
          newVM.activate()
          window.scrollTo(0, 0)
        }

        ctx.$activeVM.value.urlDidChange(page)
      })
      .subscribe()
  }
}