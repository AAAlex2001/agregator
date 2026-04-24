import os
from pathlib import Path
import sys

import pytest

CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from load_models import LoadSettings


def pytest_addoption(parser: pytest.Parser) -> None:
    group = parser.getgroup("load")
    group.addoption("--run-load", action="store_true", default=False)
    group.addoption("--load-base-url", action="store", default=None)
    group.addoption("--load-db-url", action="store", default=None)
    group.addoption("--load-rate", action="store", type=int, default=10)
    group.addoption("--load-duration", action="store", type=int, default=5)
    group.addoption("--load-timeout", action="store", type=float, default=10.0)
    group.addoption("--load-order-budget-rub", action="store", type=int, default=100)
    group.addoption("--load-max-failures", action="store", type=int, default=0)
    group.addoption("--load-max-concurrency", action="store", type=int, default=None)
    group.addoption("--load-disable-ssl-verify", action="store_true", default=False)


def pytest_collection_modifyitems(config: pytest.Config, items: list[pytest.Item]) -> None:
    if config.getoption("--run-load"):
        return
    marker = pytest.mark.skip(reason="Добавьте --run-load для запуска нагрузочных тестов")
    for item in items:
        if "load" in item.keywords:
            item.add_marker(marker)


@pytest.fixture(scope="session")
def load_settings(pytestconfig: pytest.Config) -> LoadSettings:
    base_url = pytestconfig.getoption("--load-base-url") or os.getenv("LOAD_BASE_URL") or "https://plus-resurs.com"
    db_url = pytestconfig.getoption("--load-db-url") or os.getenv("LOAD_DB_URL") or os.getenv("DATABASE_URL")
    return LoadSettings(
        base_url=base_url,
        db_url=db_url,
        rate_per_second=pytestconfig.getoption("--load-rate"),
        duration_seconds=pytestconfig.getoption("--load-duration"),
        request_timeout_seconds=pytestconfig.getoption("--load-timeout"),
        order_budget_rub=pytestconfig.getoption("--load-order-budget-rub"),
        max_failures=pytestconfig.getoption("--load-max-failures"),
        max_concurrency=pytestconfig.getoption("--load-max-concurrency"),
        verify_ssl=not pytestconfig.getoption("--load-disable-ssl-verify"),
    )
