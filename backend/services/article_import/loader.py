"Чтение статей и обложек из backend/content/articles."

import json
import shutil
from pathlib import Path
from typing import Any

from services.article_import.rules import check_article

BACKEND_ROOT = Path(__file__).resolve().parents[2]
ARTICLES_DIR = BACKEND_ROOT / "content" / "articles"
COVERS_DIR = ARTICLES_DIR / "covers"
UPLOADED_COVERS_DIR = BACKEND_ROOT / "uploads" / "articles" / "covers"
COVER_URL = "/uploads/articles/covers/{slug}.webp"


def article_paths(slugs: list[str] | None = None) -> list[Path]:
    "Файлы статей: все или только перечисленные slug, по алфавиту."
    if slugs:
        return [ARTICLES_DIR / f"{slug}.json" for slug in slugs]
    return sorted(ARTICLES_DIR.glob("*.json"))


def read_article(path: Path) -> dict[str, Any]:
    "Читает JSON статьи."
    return json.loads(path.read_text(encoding="utf-8"))


def validate_files(paths: list[Path]) -> dict[str, list[str]]:
    "Проблемы по каждому файлу; в результат попадают только файлы с проблемами."
    report: dict[str, list[str]] = {}
    for path in paths:
        if not path.exists():
            report[path.stem] = ["файл не найден"]
            continue
        try:
            article = read_article(path)
        except json.JSONDecodeError as error:
            report[path.stem] = [f"невалидный JSON: {error}"]
            continue
        problems = check_article(article, path.stem)
        if not (COVERS_DIR / f"{path.stem}.webp").exists():
            problems.append("нет обложки covers/<slug>.webp")
        if problems:
            report[path.stem] = problems
    return report


def copy_cover(slug: str) -> str:
    "Кладёт обложку в раздаваемую nginx папку uploads и возвращает её публичный URL."
    UPLOADED_COVERS_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(COVERS_DIR / f"{slug}.webp", UPLOADED_COVERS_DIR / f"{slug}.webp")
    return COVER_URL.format(slug=slug)
