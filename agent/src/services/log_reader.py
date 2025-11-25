import os
from typing import List, Dict


def collect_existing_paths(log_paths: List[Dict]) -> List[str]:
    """
    Receives a list of dicts: {"path": "...", "type": "..."}
    Returns only the paths that exist and are regular files.
    """
    existing = []
    for p in log_paths:
        path = p.get("path")
        if not path:
            continue

        if os.path.isfile(path):
            existing.append(path)
        else:
            print(f"[log_reader] file not found or not a regular file: {path}")

    return existing
