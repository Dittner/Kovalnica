
import { ViewModel } from "../ViewModel"
import { Interactor } from "../Interactor"
import { log } from "../../../app/Logger"
import { GlobalContext } from "../../../app/GlobalContext"
import { IPage } from "../../../app/URLNavigator"


export interface PageNotFoundState {}

export class PageNotFoundVM extends ViewModel<PageNotFoundState> {

  constructor(ctx: GlobalContext) {
    const interactor = new PageNotFoundInteractor(ctx)
    super('pageNotFound', ctx, interactor)
  }

  protected override stateDidChange(state: PageNotFoundState) {
    if (!this.activate) return
  }
}


class PageNotFoundInteractor extends Interactor<PageNotFoundState> {
  constructor(ctx: GlobalContext) {
    super(ctx)
    log('new PageNotFoundInteractor')
  }

  override async load(state: PageNotFoundState, page: IPage) {
    //nothing to load
  }
}