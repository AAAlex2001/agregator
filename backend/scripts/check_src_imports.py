"""Проверяет правила кода в src. Запуск из папки backend: python scripts/check_src_imports.py

1. Лестница фич: фича импортирует только фичи ниже себя.
2. Лестница подфич внутри фичи: то же самое внутри одной фичи. Чужие models.py брать можно.
3. Владелец таблицы: repository.py не импортирует модели другой фичи — их читают через её репозиторий.
4. У каждой функции и класса есть подпись в одну строку.
5. У каждого execute в сценариях есть звёздочка: аргументы передаются только по имени.
6. Строки не длиннее 110 символов.
"""

import ast
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parents[1] / "src"
MAX_LINE_LENGTH = 110

FEATURE_LADDER = [
    ["core"],
    ["accounts"],
    ["auth", "notifications"],
    ["poster", "support"],
    ["tests"],
]

SUBFEATURE_LADDERS = {
    "poster": [
        ["channels"],
        ["delivery"],
        ["posts"],
        ["reactions", "follows", "comments", "templates", "ai"],
        ["feed", "reports"],
    ],
}


def level(ladder: list[list[str]], name: str) -> int | None:
    """Возвращает ступень лестницы, на которой стоит name, или None."""
    for step, names in enumerate(ladder):
        if name in names:
            return step

    return None


def imported_modules(tree: ast.Module) -> list[tuple[int, str]]:
    """Возвращает все импорты файла: номер строки и имя модуля."""
    modules = []

    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom) and node.module:
            modules.append((node.lineno, node.module))
        elif isinstance(node, ast.Import):
            modules.extend((node.lineno, alias.name) for alias in node.names)

    return modules


def check_imports(path: Path, tree: ast.Module) -> list[str]:
    """Проверяет лестницу фич, лестницу подфич и владельцев таблиц."""
    parts = path.relative_to(SRC).parts
    feature = parts[0]
    subfeature = parts[1] if len(parts) > 2 else None
    errors = []

    for line, module in imported_modules(tree):
        target = module.split(".")

        if target[0] != "src" or len(target) < 2:
            continue

        other_feature = target[1]
        place = f"{path.relative_to(SRC.parent)}:{line}"

        if other_feature != feature:
            own_level = level(FEATURE_LADDER, feature)
            other_level = level(FEATURE_LADDER, other_feature)

            if own_level is None or other_level is None or other_level >= own_level:
                errors.append(f"{place}: фича {feature} импортирует {module} — это не ниже по лестнице")

            if path.name == "repository.py" and target[-1] == "models":
                errors.append(f"{place}: репозиторий берёт чужую таблицу {module} — нужен её репозиторий")

            continue

        ladder = SUBFEATURE_LADDERS.get(feature)

        if ladder is None or subfeature is None or len(target) < 3:
            continue

        other_subfeature = target[2]

        if other_subfeature == subfeature or target[-1] == "models":
            continue

        own_level = level(ladder, subfeature)
        other_level = level(ladder, other_subfeature)

        if own_level is None or other_level is None or other_level >= own_level:
            errors.append(f"{place}: {subfeature} импортирует {module} — это не ниже по лестнице")

    return errors


def check_docstrings_and_stars(path: Path, tree: ast.Module) -> list[str]:
    """Проверяет подписи у функций и классов и звёздочку в execute сценариев."""
    errors = []

    for node in ast.walk(tree):
        if not isinstance(node, ast.FunctionDef | ast.AsyncFunctionDef | ast.ClassDef):
            continue

        place = f"{path.relative_to(SRC.parent)}:{node.lineno}"
        docstring = ast.get_docstring(node)

        if docstring is None:
            errors.append(f"{place}: у {node.name} нет подписи")
        elif "\n" in docstring:
            errors.append(f"{place}: подпись {node.name} длиннее одной строки")

        is_usecase = "usecases" in path.parts and isinstance(node, ast.AsyncFunctionDef)

        if is_usecase and node.name == "execute" and len(node.args.args) > 1:
            errors.append(f"{place}: в execute нет звёздочки перед аргументами")

    return errors


def main() -> int:
    """Проверяет все файлы src и печатает нарушения."""
    errors = []

    for path in sorted(SRC.rglob("*.py")):
        tree = ast.parse(path.read_text(encoding="utf-8"))

        if len(path.relative_to(SRC).parts) > 1:
            errors.extend(check_imports(path, tree))

        errors.extend(check_docstrings_and_stars(path, tree))

        for number, line in enumerate(path.read_text(encoding="utf-8").split("\n"), start=1):
            if len(line) > MAX_LINE_LENGTH:
                errors.append(f"{path.relative_to(SRC.parent)}:{number}: строка длиннее {MAX_LINE_LENGTH} символов")

    for error in errors:
        print(error)

    print("Правила соблюдены" if not errors else f"Нарушений: {len(errors)}")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
