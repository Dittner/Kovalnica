import array
import re
from pathlib import Path
import json

ROOT_DIR_PATH = Path('data')


def get_files_tree(files_extension: list[str]):
    root = {'id': 'root', 'path': 'data', 'is_dir':True, 'files':[] }
    return list_dir(parent_dir=root, files_extension=files_extension)

def list_dir(parent_dir: any, files_extension: list[str]):
    p = Path(parent_dir['path'])
    for child in p.iterdir():
        if child.name.startswith('.'):
            continue

        if child.is_dir():
            f = {'id': child.name, 'path': child.as_posix(), 'is_dir':True, 'files':[] }
            if parent_dir['files'] is not None:
                parent_dir['files'].append(f)
            list_dir(f, files_extension)

        elif child.suffix in files_extension:
            f = {'id': child.name, 'path': child.as_posix(), 'is_dir':False, 'files':None }
            if parent_dir['files'] is not None:
                parent_dir['files'].append(f)

    return parent_dir



def main():
    print('---- Proccessing...')
    pp = []
    root = get_files_tree(['.png', '.jpeg', '.jpg'])
    with open("data.json", "w", encoding="utf-8") as file:
        json.dump(root, file, indent=4, ensure_ascii=False)
    
    print('---- Complete')


if __name__ == '__main__':
    main()
