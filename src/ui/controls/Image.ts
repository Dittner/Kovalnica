import { UIComponent, UIComponentProps } from "flinker-dom"
import { logWarn } from "../../app/Logger"

export interface ImageCanvasProps extends UIComponentProps {
  src?: string
  canvasWidth: number
  canvasHeight: number
  fitTo: 'canvasWidth' | 'canvasHeight'
}

export class ImageCanvas<P extends ImageCanvasProps> extends UIComponent<P> {
  private src: string = ''
  private image = new Image()
  private canvasContext: CanvasRenderingContext2D | null

  constructor() {
    super('canvas')
    const imageCanvasDom = this.dom as HTMLCanvasElement
    this.canvasContext = imageCanvasDom.getContext("2d")
  }

  protected override didDomUpdate(): void {
    super.didDomUpdate()
    if (this.props.src && this.props.src !== this.src) {
      this.src = this.props.src
      this.image.onload = () => {
        this.redrawImage()
      }
      this.image.src = this.src
    } else {
      this.redrawImage()
    }
  }

  private redrawImage() {
    if (!this.canvasContext) {
      logWarn('ImageCanvas::redrawImage, canvasContext is null, method getContext("2d") is not supported!')
      return
    }

    const imageCanvasDom = this.dom as HTMLCanvasElement
    this.canvasContext.clearRect(0, 0, imageCanvasDom.width, imageCanvasDom.height)

    this.dom.setAttribute('width', this.props.canvasWidth + 'px')
    this.dom.setAttribute('height', this.props.canvasHeight + 'px')

    const originX = 0
    const originY = 0
    const originWidth = this.image.width
    const originHeight = this.image.height

    if (this.props.fitTo === 'canvasHeight') {
      const scale = this.props.canvasHeight / this.image.height
      const destWidth = this.image.width * scale
      const destHeight = this.image.height * scale
      const destX = (this.props.canvasWidth - destWidth) / 2
      const destY = 0
      this.canvasContext.drawImage(this.image, originX, originY, originWidth, originHeight, destX, destY, destWidth, destHeight)
    } else {
      const scale = this.props.canvasWidth / this.image.width
      const destWidth = this.image.width * scale
      const destHeight = this.image.height * scale
      const destX = 0
      const destY = (this.props.canvasHeight - destHeight) / 2
      this.canvasContext.drawImage(this.image, originX, originY, originWidth, originHeight, destX, destY, destWidth, destHeight)
    }
  }
}

export const FittedImage = <P extends ImageCanvasProps>() => {
  return new ImageCanvas<P>()
}