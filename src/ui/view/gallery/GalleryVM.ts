
import { ViewModel } from "../ViewModel"
import { Interactor } from "../Interactor"
import { log, logWarn } from "../../../app/Logger"
import { IGalleryFile } from "../../../domain/DomainModel"
import { GlobalContext } from "../../../app/GlobalContext"
import { IPage } from "../../../app/URLNavigator"
import { RXObservableValue } from "flinker"
import { sortByKey } from "../../../app/Utils"

export interface IPhoto {
  readonly id: string
  readonly path: string
  readonly preloadPath: string
  readonly parent: string
}

export interface GalleryPageState {
  photos: IPhoto[]
}

export class GalleryVM extends ViewModel<GalleryPageState> {
  readonly $photos = new RXObservableValue<IPhoto[]>([])
  readonly $isPhotoViewerShown = new RXObservableValue(false)
  readonly $selectedPhotoIndex = new RXObservableValue(0)

  constructor(ctx: GlobalContext) {
    const interactor = new GalleryInteractor(ctx)
    super('gallery', ctx, interactor)
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  protected override stateDidChange(state: GalleryPageState) {
    this.$photos.value = state.photos ?? []
  }

  openPhotoViewer(photo: IPhoto) {
    const photIndex = this.$photos.value.findIndex(p => p === photo)
    this.$selectedPhotoIndex.value = photIndex === -1 ? 0 : photIndex
    this.$isPhotoViewerShown.value = true
  }

  closePhotoViewer() {
    this.$isPhotoViewerShown.value = false
  }

  canNavigateNextPhoto() {
    return this.$selectedPhotoIndex.value < this.$photos.value.length - 1
  }

  canNavigatePrevPhoto() {
    return this.$selectedPhotoIndex.value > 0
  }

  prevPhoto() {
    if (this.canNavigatePrevPhoto())
      this.$selectedPhotoIndex.value -= 1
  }

  nextPhoto() {
    if (this.canNavigateNextPhoto())
      this.$selectedPhotoIndex.value += 1
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (document.activeElement?.tagName === 'INPUT') return
    if (!this.$isPhotoViewerShown.value) return

    switch (e.key) {
      case ('Escape'): this.closePhotoViewer(); break;
      case ('ArrowLeft'): this.prevPhoto(); break;
      case ('ArrowRight'): this.nextPhoto(); break;
    }
  }
}

class GalleryInteractor extends Interactor<GalleryPageState> {
  private cachedPhotos: IPhoto[] | undefined = undefined
  constructor(ctx: GlobalContext) {
    super(ctx)
    log('new GalleryInteractor')
  }

  override async load(state: GalleryPageState, page: IPage) {
    await this.loadGalleryFilesTree(state, page)
  }

  private async loadGalleryFilesTree(state: GalleryPageState, page: IPage) {
    if (this.cachedPhotos) {
      state.photos = this.cachedPhotos
      return
    }

    try {
      const response = await fetch('resources/data.json');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const rootFile = await response.json() as IGalleryFile
      //log(data)
      if (rootFile.files) {
        this.sortFiles(rootFile)

        for (const d of rootFile.files) {
          if (d.is_dir && d.id === 'photos') {
            state.photos = this.parseAndFlattenFiles(d)
            if (state.photos.length > 0) this.cachedPhotos = state.photos
          }
        }

      } else {
        state.photos = []
      }

    } catch (error) {
      logWarn('Failed to load text file:', error);
    }
  }


  private sortFiles(dir: IGalleryFile) {
    if (dir.files) {
      dir.files.sort(sortByKey('path'))
      for (const f of dir.files)
        if (f.is_dir)
          this.sortFiles(f)
    }
  }

  private parseAndFlattenFiles(dir: IGalleryFile): IPhoto[] {
    const res: IPhoto[] = []
    if (dir.files) {
      for (const f of dir.files) {
        if (f.is_dir) this.parseAndFlattenFiles(f).forEach(item => {
          res.push({
            id: item.id,
            path: item.path,
            preloadPath: item.path.replace('photos/', 'preload/'),
            parent: this.translateDir(f.id)
          })
        })
        else res.push({
          id: f.id,
          path: f.path,
          preloadPath: f.path.replace('photos/', 'preload/'),
          parent: this.translateDir(dir.id)
        })
      }
      return res
    } else {
      return []
    }
  }

  private translateDir(dirId: string): string {
    switch (dirId) {
      case '01_stairs': return 'Лестницы'
      case '02_gates': return 'Ворота'
      case '03_balconys': return 'Балконы'
      case '04_visors': return 'Козырьки, входная конструкция'
      case '05_others': return 'Другое'
      default: return dirId
    }
  }
}