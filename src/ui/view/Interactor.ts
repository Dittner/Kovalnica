import { RXObservableValue } from "flinker"
import { IPage } from "../../app/URLNavigator"
import { log } from "../../app/Logger"
import { GlobalContext } from "../../app/GlobalContext"

export class Interactor<State> {
  readonly ctx: GlobalContext
  readonly $state = new RXObservableValue<State>({} as State)
  prevState: State = {} as State

  constructor(ctx: GlobalContext) {
    this.ctx = ctx
  }

  private unsubscribeColl: (() => void)[] = []
  dispose(): void {
    this.unsubscribeColl.forEach(f => f())
    this.unsubscribeColl.length = 0
  }

  private isLoading = false
  private reloadCycleDepth = 0
  private newPage: IPage | undefined

  async run(page: IPage) {
    if (this.isLoading) {
      log('Got keys when loading')
      this.newPage = page
      return
    }

    const state: State = {} as State

    try {
      this.newPage = undefined
      this.isLoading = true

      await this.load(state, page)

      this.prevState = state
      this.isLoading = false

      if (this.newPage) {
        this.reloadCycleDepth++
        if (this.reloadCycleDepth > 10) this.ctx.$msg.value = { text: 'Infinite loop of reloading pages', level: 'warning' }
        else this.run(this.newPage)
      }
      else {
        this.reloadCycleDepth = 0
        this.$state.value = state
      }

    } catch (e: any) {
      log('Error:', e)
      this.errorDidCatch(e, state)
      this.$state.value = {} as State
    } finally {
      this.reloadCycleDepth = 0
    }
  }

  async load(state: State, page: IPage) { }

  protected errorDidCatch(e: any, state: State) {
    this.ctx.$msg.value = { level: 'error', text: e.message }
  }

  clearCache() {
    this.prevState = {} as State
  }
}
