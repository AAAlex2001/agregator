"""Проверка статей backend/content/articles перед загрузкой в БД.

python -m scripts.validate_articles            все статьи
python -m scripts.validate_articles <slug>...  выбранные
"""

import sys

from services.article_import import article_paths, validate_files


def main(slugs: list[str]) -> int:
    paths = article_paths(slugs)
    report = validate_files(paths)
    for slug, problems in report.items():
        print(slug)
        for problem in problems:
            print(f"  - {problem}")
    print(f"Проверено: {len(paths)}, в порядке: {len(paths) - len(report)}, с замечаниями: {len(report)}")
    return 1 if report else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
