import { IPage, URLNavigator } from "../../app/URLNavigator"
import { globalContext } from "../../App"
import { Interactor } from "./Interactor"
import { log } from "../../app/Logger"
import { GlobalContext } from "../../app/GlobalContext"

export type ViewModelID = 'about' | 'gallery' | 'contacts' | 'pageNotFound'
export interface IViewModel {
  readonly id: ViewModelID
  urlDidChange(page: IPage): void
  activate(): void
  deactivate(): void
}

export class ViewModel<ViewModelState> implements IViewModel {
  readonly id: ViewModelID
  readonly ctx: GlobalContext
  readonly navigator: URLNavigator
  readonly interactor: Interactor<ViewModelState>


  constructor(id: ViewModelID, ctx: GlobalContext, interactor: Interactor<ViewModelState>) {
    this.id = id
    this.ctx = ctx
    this.navigator = globalContext.navigator

    this.interactor = interactor
    interactor.$state.pipe()
      .skipFirst()
      .onReceive(s => this.stateDidChange(s))
      .subscribe()
  }

  get isActive(): boolean {
    return this.ctx.$activeVM.value?.id == this.id
  }

  activate(): void {
    log(`VM <${this.id}> is activated`)
    this.interactor.clearCache()
  }

  deactivate(): void {
  }

  urlDidChange(page: IPage): void {
    this.interactor.run(page)
  }

  navigateToHome() {
    this.navigator.navigateTo('')
  }

  protected stateDidChange(state: ViewModelState) { }
}
