
import { ViewModel } from "../ViewModel"
import { Interactor } from "../Interactor"
import { log, logWarn } from "../../../app/Logger"
import { GlobalContext } from "../../../app/GlobalContext"
import { IPage } from "../../../app/URLNavigator"
import { RXObservableValue } from "flinker"


export interface ContactsPageState {
  content: string
}

export class ContactsVM extends ViewModel<ContactsPageState> {
  readonly $content = new RXObservableValue('')

  constructor(ctx: GlobalContext) {
    const interactor = new ContactsInteractor(ctx)
    super('contacts', ctx, interactor)
  }

  protected override stateDidChange(state: ContactsPageState) {
    this.$content.value = state.content
  }
}


class ContactsInteractor extends Interactor<ContactsPageState> {
  constructor(ctx: GlobalContext) {
    super(ctx)
    log('new ContactsInteractor')
  }

  override async load(state: ContactsPageState, page: IPage) {
    try {
      const response = await fetch('resources/contacts.md');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      state.content = await response.text();
    } catch (error) {
      logWarn('Failed to load text file:', error);
      state.content = 'Не удалость загрузить текст'
    }
  }
}