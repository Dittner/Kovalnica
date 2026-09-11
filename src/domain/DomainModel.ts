
export interface IGalleryFile {
  readonly id: string
  readonly path: string
  readonly is_dir: boolean
  readonly files: IGalleryFile[] | undefined
}