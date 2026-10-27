
import { ViewModel } from "../ViewModel"
import { Interactor } from "../Interactor"
import { log } from "../../../app/Logger"
import { GlobalContext } from "../../../app/GlobalContext"
import { IPage } from "../../../app/URLNavigator"

export interface IPhoto {
  readonly id: string
  readonly path: string
  readonly preloadPath: string
  readonly parent: string
}

export interface NewItemsState {
}

export class NewItemsVM extends ViewModel<NewItemsState> {
  readonly photoLinks: string[] = [
    '/data/photos/05_others/R12.jpg',
    '/data/photos/05_others/R13.jpg',
    '/data/photos/05_others/R14.jpg',
    '/data/photos/05_others/R15.jpg'
  ]

  constructor(ctx: GlobalContext) {
    const interactor = new ImageInteractor(ctx)
    super('newItems', ctx, interactor)
  }

  protected override stateDidChange(state: NewItemsState) {
    //this.$link.value = state.link ?? ''
  }
}

class ImageInteractor extends Interactor<NewItemsState> {
  constructor(ctx: GlobalContext) {
    super(ctx)
    log('new ImageInteractor')
  }

  override async load(state: NewItemsState, page: IPage) {
    //state.link = '/data/photos/01_stairs/S05.jpg'
  }
}