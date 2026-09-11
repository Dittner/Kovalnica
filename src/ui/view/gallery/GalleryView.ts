import { h2, h5, hstack, image, p, spacer, vstack } from "flinker-dom"
import { darkTheme, theme } from "../../theme/ThemeManager"
import { layout } from "../../../app/Application"
import { globalContext } from "../../../App"
import { ViewLayer } from "../../../app/ViewLayer"
import { Btn, IconBtn } from "../../controls/Button"
import { MaterialIcon } from "../../icons/MaterialIcon"
import { FontFamily } from "../../controls/Font"
import { IPhoto } from "./GalleryVM"
import { log } from "../../../app/Logger"

export const GalleryView = () => {
  const vm = globalContext.vmFactory.getGalleryVM()
  return vstack()
    .react(s => {
      s.width = '100%'
      s.halign = 'left'
      s.valign = 'top'
      s.paddingLeft = layout().contentLeftOffset + 'px'
      s.paddingVertical = '50px'
      s.bgColor = theme().appBg
      s.minHeight = window.innerHeight - layout().navBarHeight - layout().footerHeight + 'px'
    })
    .children(() => {

      DirectoryList()
        .react(s => {
          s.valign = 'center'
          s.halign = 'left'
          s.paddingHorizontal = layout().paddingHorizontal + 'px'
          s.width = layout().contentWidth + 'px'
          s.gap = '0px'
        })


      PhotoViewer()
        .observe(vm.$isPhotoViewerShown)
        .react(s => {
          s.visible = vm.$isPhotoViewerShown.value
          s.position = 'fixed'
          s.left = '0'
          s.top = '0'
          s.width = '100vw'
          s.height = '100vh'
          s.halign = 'center'
          s.valign = 'top'
          //s.gap = '20px'
          s.bgColor = darkTheme().appBg
          s.layer = ViewLayer.MODAL_VIEW
        })
    })
}


const DirectoryList = () => {
  const vm = globalContext.vmFactory.getGalleryVM()

  return vstack()
    .observe(vm.$photos, 'recreateChildren')
    .children(() => {

      log('DirectoryList, rerendering all preload photos')

      const dirs: IPhoto[][] = []
      let dirName = ''
      vm.$photos.value.forEach(ph => {
        if (dirName != ph.parent) {
          dirName = ph.parent
          dirs.push([])
        }
        dirs[dirs.length - 1].push(ph)
      })

      dirs.forEach(photos => {
        h2()
          .react(s => {
            //s.fontFamily = FontFamily.VERDANA
            s.width = '100%'
            //s.textColor = theme().header
            s.text = photos[0].parent
            //s.fontSize = theme().fontSizeL
            s.paddingBottom = '20px'
          })

        PhotosList(photos)



        spacer().react(s => {
          s.height = '150px'
        })
      })
    })
}

const PhotosList = (photos: IPhoto[]) => {
  const vm = globalContext.vmFactory.getGalleryVM()

  return hstack()
    .react(s => {
      s.width = '100%'
      s.maxWidth = '770px'
      s.halign = 'left'
      s.valign = 'top'
      s.gap = '10px'
    })
    .children(() => {
      const columns = [0, 1, 2]
      columns.forEach(col => {
        vstack()
          .react(s => {
            s.halign = 'left'
            //s.className = 'tile-grid'
            s.width = '33%'
            s.gap = '10px'
          })
          .children(() => {

            photos.forEach((ph, i) => {
              if (i % 3 === col) {
                image()
                  .react(s => {
                    s.src = ph.preloadPath
                    s.loading = 'lazy'
                    s.width = '100%'
                    s.maxWidth = '250px'
                    //log('s.src=', s.src)
                    s.cursor = 'pointer'
                  })
                  .whenHovered(s => {
                    s.outline = '10px solid ' + theme().red
                  })
                  .onClick(() => vm.openPhotoViewer(ph))
              }
            })
          })
      })
    })
}


const PhotoViewer = () => {
  const vm = globalContext.vmFactory.getGalleryVM()
  return vstack()
    .children(() => {

      //header
      hstack()
        .react(s => {
          s.width = '100%'
          s.height = layout().navBarHeight + 'px'
          s.halign = 'left'
          s.valign = 'center'
          s.gap = '20px'
          s.bgColor = darkTheme().navBarBg
          s.paddingHorizontal = layout().paddingHorizontal + 'px'
        })
        .children(() => {
          vstack().react(s => {
            s.halign = 'left'
            s.valign = 'center'
            s.width = 'unset'
          })
            .children(() => {
              h5()
                .observe(vm.$selectedPhotoIndex)
                .react(s => {
                  const photo = vm.$selectedPhotoIndex.value < vm.$photos.value.length ? vm.$photos.value[vm.$selectedPhotoIndex.value] : undefined
                  s.textColor = darkTheme().header
                  s.text = photo ? photo.parent + '. ' + photo.id : ''
                })

              p()
                .observe(vm.$selectedPhotoIndex)
                .react(s => {
                  s.fontFamily = FontFamily.MONO
                  s.textColor = darkTheme().text
                  s.text = (vm.$selectedPhotoIndex.value + 1) + '/' + vm.$photos.value.length
                })
            })

          spacer()

          Btn()
            .observe(vm.$selectedPhotoIndex)
            .react(s => {
              s.iconSize = '1.2rem'
              s.icon = MaterialIcon.close
              s.text = 'Закрыть'
              s.textColor = darkTheme().black
              s.paddingLeft = '10px'
              s.paddingRight = '15px'
              s.paddingVertical = '5px'
              s.popUp = 'Выйти из режима просмотра (ESC)'
              s.bgColor = darkTheme().white
            })
            .whenHovered(s => {
              s.bgColor = darkTheme().white + 'cc'
            })
            .onClick(() => {
              vm.closePhotoViewer()
            })
        })

      spacer()

      //photoNavigation
      hstack().react(s => {
        s.width = '100%'
        s.height = window.innerHeight - layout().navBarHeight + 'px'
        s.halign = 'center'
        s.valign = 'center'
        s.paddingHorizontal = '50px'
      })
        .children(() => {

          NavBtn()
            .observe(vm.$selectedPhotoIndex)
            .react(s => {
              s.position = 'absolute'
              s.left = layout().paddingHorizontal + 'px'
              if (layout().isMobile)
                s.bottom = window.innerHeight / 4 + 'px'
              s.icon = MaterialIcon.arrow_back
              s.isDisabled = !vm.canNavigatePrevPhoto()
              s.popUp = 'Предыдущее фото (клавиша влево)'
            })
            .onClick(() => {
              vm.prevPhoto()
            })

          spacer()

          image()
            .observe(vm.$selectedPhotoIndex)
            .react(s => {
              const photo = vm.$selectedPhotoIndex.value < vm.$photos.value.length ? vm.$photos.value[vm.$selectedPhotoIndex.value] : undefined
              s.src = photo?.path ?? ''
              s.loading = 'lazy'
              s.maxWidth = window.innerWidth + 'px'
              s.maxHeight = window.innerHeight - 50 - layout().navBarHeight + 'px'
              s.border = '15px solid #ffFFff'
              //s.outline = '20px solid ' + darkTheme().text50
            })

          spacer()

          NavBtn()
            .observe(vm.$selectedPhotoIndex)
            .react(s => {
              s.position = 'absolute'
              s.right = layout().paddingHorizontal + 'px'
              if (layout().isMobile)
                s.bottom = window.innerHeight / 4 + 'px'
              s.icon = MaterialIcon.arrow_forward
              s.isDisabled = !vm.canNavigateNextPhoto()
              s.popUp = 'Следующее фото (клавиша вправо)'
            })
            .onClick(() => {
              vm.nextPhoto()
            })

        })

      spacer()
    })
}


const NavBtn = () => {
  return IconBtn()
    .react(s => {
      s.iconSize = '1.4rem'
      s.width = '60px'
      s.height = '50px'
      s.bgColor = darkTheme().red
      s.textColor = '#ffFFff'
      s.borderColor = darkTheme().red + '40'
      s.cornerRadius = '4px'
    })
    .whenHovered(s => {
      s.bgColor = darkTheme().red + 'cc'
    })
}