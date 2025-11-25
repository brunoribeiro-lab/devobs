import os
from typing import List


def remove_files(files: List[str]) -> None:
    for f in files:
        try:
            os.remove(f)
            print(f"[cleaner] removed: {f}")
        except Exception as e:
            print(f"[cleaner] error removing {f}: {e}")
