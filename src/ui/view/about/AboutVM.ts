
import { ViewModel } from "../ViewModel"
import { Interactor } from "../Interactor"
import { log, logWarn } from "../../../app/Logger"
import { GlobalContext } from "../../../app/GlobalContext"
import { IPage } from "../../../app/URLNavigator"
import { RXObservableValue } from "flinker"


export interface AboutVMState {
  content: string
}

export class AboutVM extends ViewModel<AboutVMState> {
  readonly $content = new RXObservableValue('')

  constructor(ctx: GlobalContext) {
    const interactor = new HomeInteractor(ctx)
    super('about', ctx, interactor)
  }

  protected override stateDidChange(state: AboutVMState) {
    this.$content.value = state.content
  }
}


class HomeInteractor extends Interactor<AboutVMState> {
  constructor(ctx: GlobalContext) {
    super(ctx)
    log('new HomeInteractor')
  }

  override async load(state: AboutVMState, page: IPage) {
    try {
      const response = await fetch('resources/about.md');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      state.content = await response.text();
    } catch (error) {
      logWarn('Failed to load text file:', error);
      state.content = 'Не удалость загрузить текст'
      //throw error;
    }
  }
}