from __future__ import annotations

import asyncio
from dataclasses import dataclass
from math import ceil
from statistics import fmean
from time import perf_counter
from typing import Awaitable, Callable


@dataclass(slots=True)
class ScenarioRequestResult:
    iteration: int
    started_at: float
    finished_at: float
    success: bool
    error: str = ""

    @property
    def latency_ms(self) -> float:
        return (self.finished_at - self.started_at) * 1000


@dataclass(slots=True)
class ScenarioReport:
    scenario: str
    total_requests: int
    success_count: int
    failure_count: int
    actual_rps: float
    mean_latency_ms: float
    p95_latency_ms: float
    max_latency_ms: float
    min_latency_ms: float
    errors: list[str]

    @classmethod
    def from_results(
        cls,
        scenario: str,
        results: list[ScenarioRequestResult],
        started_at: float,
        finished_at: float,
    ) -> "ScenarioReport":
        latencies = [result.latency_ms for result in results]
        errors = [result.error for result in results if result.error]
        duration = max(finished_at - started_at, 0.001)
        return cls(
            scenario=scenario,
            total_requests=len(results),
            success_count=sum(1 for result in results if result.success),
            failure_count=sum(1 for result in results if not result.success),
            actual_rps=len(results) / duration,
            mean_latency_ms=fmean(latencies) if latencies else 0.0,
            p95_latency_ms=calculate_percentile(latencies, 95),
            max_latency_ms=max(latencies) if latencies else 0.0,
            min_latency_ms=min(latencies) if latencies else 0.0,
            errors=errors[:10],
        )

    def render(self) -> str:
        lines = [
            f"scenario={self.scenario}",
            f"total={self.total_requests}",
            f"success={self.success_count}",
            f"failed={self.failure_count}",
            f"rps={self.actual_rps:.2f}",
            f"latency_ms=min:{self.min_latency_ms:.2f} mean:{self.mean_latency_ms:.2f} p95:{self.p95_latency_ms:.2f} max:{self.max_latency_ms:.2f}",
        ]
        if self.errors:
            lines.extend(f"error={error}" for error in self.errors)
        return "\n".join(lines)

    def assert_expected(self, max_failures: int) -> None:
        if self.failure_count > max_failures:
            raise AssertionError(self.render())


def calculate_percentile(values: list[float], percentile: int) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    index = max(0, ceil((percentile / 100) * len(ordered)) - 1)
    return ordered[index]


async def run_load_scenario(
    scenario: str,
    rate_per_second: int,
    duration_seconds: int,
    execute: Callable[[int], Awaitable[None]],
) -> ScenarioReport:
    total_requests = rate_per_second * duration_seconds
    started_at = perf_counter()
    tasks = []

    for iteration in range(total_requests):
        scheduled_at = started_at + (iteration / rate_per_second)
        delay = scheduled_at - perf_counter()
        if delay > 0:
            await asyncio.sleep(delay)
        tasks.append(asyncio.create_task(run_iteration(iteration, execute)))

    results = await asyncio.gather(*tasks)
    finished_at = perf_counter()
    return ScenarioReport.from_results(scenario, results, started_at, finished_at)


async def run_iteration(
    iteration: int,
    execute: Callable[[int], Awaitable[None]],
) -> ScenarioRequestResult:
    started_at = perf_counter()
    try:
        await execute(iteration)
    except Exception as error:
        return ScenarioRequestResult(
            iteration=iteration,
            started_at=started_at,
            finished_at=perf_counter(),
            success=False,
            error=f"{type(error).__name__}: {error}",
        )
    return ScenarioRequestResult(
        iteration=iteration,
        started_at=started_at,
        finished_at=perf_counter(),
        success=True,
    )
