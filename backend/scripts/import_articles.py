"""Загрузка статей backend/content/articles в БД.

    python -m scripts.import_articles            все статьи
    python -m scripts.import_articles <slug>...  выбранные

Сначала все файлы проходят валидатор; при замечаниях загрузка не начинается.
Каждая статья сохраняется отдельной транзакцией, повторный запуск обновляет записи по slug.
"""

import asyncio
import sys

from database.database import AsyncSessionLocal
from services.article_import import (
    ImportArticleUseCase,
    LegacyNewsRepository,
    article_paths,
    read_article,
    validate_files,
)
from services.articles import ArticleRepository
from services.tags import TagRepository


async def main(slugs: list[str]) -> int:
    paths = article_paths(slugs)
    report = validate_files(paths)
    if report:
        for slug, problems in report.items():
            print(slug)
            for problem in problems:
                print(f"  - {problem}")
        print(f"Загрузка отменена: замечания в {len(report)} файлах из {len(paths)}")
        return 1

    created = updated = 0
    for index, path in enumerate(paths, start=1):
        article = read_article(path)
        async with AsyncSessionLocal.begin() as db:
            use_case = ImportArticleUseCase(
                ArticleRepository(db), TagRepository(db), LegacyNewsRepository(db)
            )
            if await use_case.execute(article):
                created += 1
            else:
                updated += 1
        if index % 50 == 0:
            print(f"{index}/{len(paths)}: {path.stem}")
    print(f"Готово. Создано: {created}, обновлено: {updated}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main(sys.argv[1:])))
