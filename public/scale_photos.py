from pathlib import Path

from PIL import Image  # pip install pillow

MAX_WIDTH_PX = 250

PHOTOS_DIR_PATH = Path('data/photos')
DESTINATION_DIR_PATH = Path('data/preload')

if not DESTINATION_DIR_PATH.exists():
    Path.mkdir(DESTINATION_DIR_PATH)


def list_dir(parent_dir_path: str, files_extension: list[str], res: list[Path]):
    p = PHOTOS_DIR_PATH / parent_dir_path
    for child in p.iterdir():
        if child.name.startswith('.'):
            continue

        if child.is_dir():
            child_dir_path = child.relative_to(PHOTOS_DIR_PATH).as_posix()
            list_dir(child_dir_path, files_extension, res)

        elif child.suffix in files_extension:
            res.append(child.relative_to(PHOTOS_DIR_PATH))

    return res


def scale(pp: list[Path]):
    for p in pp:
        origin_p = PHOTOS_DIR_PATH / p
        dest_p = DESTINATION_DIR_PATH / p
        if not dest_p.exists():
            # Create the parent directory structure
            dest_p.parent.mkdir(parents=True, exist_ok=True)

            img = Image.open(origin_p.as_posix())

            factor = MAX_WIDTH_PX / img.width
            if factor >= 1:
                img.save(dest_p.as_posix())
            else:
                new_width = int(img.width * factor)
                new_height = int(img.height * factor)

                # Resize and save
                scaled_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                scaled_img.save(dest_p.as_posix())


def main():
    print('---- Proccessing...')
    pp = []
    list_dir('', ['.png', '.jpeg', '.jpg'], pp)
    scale(pp)
    print('---- Complete')


if __name__ == '__main__':
    main()
