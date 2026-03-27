from __future__ import annotations

from load_api import LoadApi
from load_models import LoadSettings, PreparedOrder, PreparedResponseWorld, RegisteredUser, RoleName, UserSession
from load_runner import ScenarioReport, run_load_scenario

import pytest


async def close_registered_sessions(sessions: list[UserSession]) -> None:
    for session in sessions:
        await session.close()


async def close_prepared_orders(prepared_orders: list[PreparedOrder]) -> None:
    await close_registered_sessions([prepared_order.customer for prepared_order in prepared_orders])


async def close_response_worlds(worlds: list[PreparedResponseWorld]) -> None:
    for world in worlds:
        await world.customer.close()
        await world.expert.close()


async def prepare_registered_users(
    api: LoadApi,
    scenario: str,
    total: int,
) -> list[RegisteredUser]:
    users = []
    for iteration in range(total):
        role: RoleName = "CUSTOMER" if iteration % 2 == 0 else "EXPERT"
        users.append(await api.create_registered_user(scenario, iteration, role))
    return users


async def prepare_authenticated_users(
    api: LoadApi,
    scenario: str,
    total: int,
    role: RoleName | None = None,
) -> list[UserSession]:
    sessions = []
    for iteration in range(total):
        current_role: RoleName = role or ("CUSTOMER" if iteration % 2 == 0 else "EXPERT")
        sessions.append(await api.create_authenticated_session(scenario, iteration, current_role))
    return sessions


async def prepare_orders(api: LoadApi, scenario: str, total: int) -> list[PreparedOrder]:
    prepared_orders = []
    for iteration in range(total):
        prepared_orders.append(await api.prepare_order(scenario, iteration))
    return prepared_orders


async def prepare_response_worlds(
    api: LoadApi,
    scenario: str,
    total: int,
) -> list[PreparedResponseWorld]:
    worlds = []
    for iteration in range(total):
        customer = await api.create_authenticated_session(scenario, iteration, "CUSTOMER")
        expert = await api.create_authenticated_session(scenario, iteration, "EXPERT")
        try:
            await api.set_expert_balance(expert.user.id)
            order = await api.create_order(customer, scenario, iteration)
            worlds.append(PreparedResponseWorld(customer=customer, expert=expert, order=order))
        except Exception:
            await customer.close()
            await expert.close()
            raise
    return worlds


async def prepare_chat_worlds(
    api: LoadApi,
    scenario: str,
    total: int,
) -> list[PreparedResponseWorld]:
    worlds = await prepare_response_worlds(api, scenario, total)
    try:
        for iteration, world in enumerate(worlds):
            response = await api.create_response(world.expert, world.order, scenario, iteration)
            world.response = await api.update_response_status(world.customer, response.id, "ACCEPTED")
            world.chat = await api.open_chat(world.customer, world.order.id)
        return worlds
    except Exception:
        await close_response_worlds(worlds)
        raise


async def prepare_expert_order_worlds(
    api: LoadApi,
    scenario: str,
    total: int,
) -> list[PreparedResponseWorld]:
    worlds = await prepare_response_worlds(api, scenario, total)
    try:
        for iteration, world in enumerate(worlds):
            response = await api.create_response(world.expert, world.order, scenario, iteration)
            accepted = await api.update_response_status(world.customer, response.id, "ACCEPTED")
            world.response = await api.update_response_status(world.customer, accepted.id, "IN_PROGRESS")
        return worlds
    except Exception:
        await close_response_worlds(worlds)
        raise


def assert_report(report: ScenarioReport, settings: LoadSettings) -> None:
    print(report.render())
    report.assert_expected(settings.max_failures)


def run_scenario(
    scenario: str,
    load_settings: LoadSettings,
    execute,
):
    return run_load_scenario(
        scenario=scenario,
        rate_per_second=load_settings.rate_per_second,
        duration_seconds=load_settings.duration_seconds,
        max_concurrency=load_settings.effective_max_concurrency,
        execute=execute,
    )


@pytest.mark.load
@pytest.mark.asyncio
async def test_registration_load(load_settings: LoadSettings) -> None:
    async with LoadApi(load_settings) as api:
        async def execute(iteration: int) -> None:
            role: RoleName = "CUSTOMER" if iteration % 2 == 0 else "EXPERT"
            await api.create_registered_user("registration", iteration, role)

        report = await run_scenario("registration", load_settings, execute)
        assert_report(report, load_settings)


@pytest.mark.load
@pytest.mark.asyncio
async def test_login_load(load_settings: LoadSettings) -> None:
    async with LoadApi(load_settings) as api:
        users = await prepare_registered_users(api, "login-prepare", load_settings.total_iterations)

        async def execute(iteration: int) -> None:
            async with api.build_client() as client:
                await api.login_user(client, users[iteration])

        report = await run_scenario("login", load_settings, execute)
        assert_report(report, load_settings)


@pytest.mark.load
@pytest.mark.asyncio
async def test_create_order_load(load_settings: LoadSettings) -> None:
    async with LoadApi(load_settings) as api:
        sessions = await prepare_authenticated_users(
            api,
            "create-order-prepare",
            load_settings.total_iterations,
            role="CUSTOMER",
        )
        try:
            async def execute(iteration: int) -> None:
                await api.create_order(sessions[iteration], "create-order", iteration)

            report = await run_scenario("create-order", load_settings, execute)
            assert_report(report, load_settings)
        finally:
            await close_registered_sessions(sessions)


@pytest.mark.load
@pytest.mark.asyncio
async def test_create_response_load(load_settings: LoadSettings) -> None:
    async with LoadApi(load_settings) as api:
        if not api.has_database:
            pytest.skip("Нужен доступ к БД через LOAD_DB_URL или DATABASE_URL")
        worlds = await prepare_response_worlds(api, "response-prepare", load_settings.total_iterations)
        try:
            async def execute(iteration: int) -> None:
                world = worlds[iteration]
                world.response = await api.create_response(world.expert, world.order, "response", iteration)

            report = await run_scenario("create-response", load_settings, execute)
            assert_report(report, load_settings)
        finally:
            await close_response_worlds(worlds)


@pytest.mark.load
@pytest.mark.asyncio
async def test_update_profile_load(load_settings: LoadSettings) -> None:
    async with LoadApi(load_settings) as api:
        sessions = await prepare_authenticated_users(api, "profile-prepare", load_settings.total_iterations)
        try:
            async def execute(iteration: int) -> None:
                await api.update_profile(sessions[iteration], "profile", iteration)

            report = await run_scenario("update-profile", load_settings, execute)
            assert_report(report, load_settings)
        finally:
            await close_registered_sessions(sessions)


@pytest.mark.load
@pytest.mark.asyncio
async def test_chat_load(load_settings: LoadSettings) -> None:
    async with LoadApi(load_settings) as api:
        if not api.has_database:
            pytest.skip("Нужен доступ к БД через LOAD_DB_URL или DATABASE_URL")
        worlds = await prepare_chat_worlds(api, "chat-prepare", load_settings.total_iterations)
        try:
            async def execute(iteration: int) -> None:
                world = worlds[iteration]
                customer_chat = await api.open_chat(world.customer, world.order.id)
                expert_chat = await api.open_chat(world.expert, world.order.id)
                await api.send_chat_message(world.customer, customer_chat.uuid, f"customer message {iteration}")
                await api.send_chat_message(world.expert, expert_chat.uuid, f"expert message {iteration}")

            report = await run_scenario("chat", load_settings, execute)
            assert_report(report, load_settings)
        finally:
            await close_response_worlds(worlds)


@pytest.mark.load
@pytest.mark.asyncio
async def test_customer_order_update_load(load_settings: LoadSettings) -> None:
    async with LoadApi(load_settings) as api:
        prepared_orders = await prepare_orders(api, "customer-update-prepare", load_settings.total_iterations)
        try:
            async def execute(iteration: int) -> None:
                prepared_order = prepared_orders[iteration]
                await api.update_order(prepared_order.customer, prepared_order.order, "customer-update", iteration)

            report = await run_scenario("customer-order-update", load_settings, execute)
            assert_report(report, load_settings)
        finally:
            await close_prepared_orders(prepared_orders)


@pytest.mark.load
@pytest.mark.asyncio
async def test_expert_order_update_load(load_settings: LoadSettings) -> None:
    async with LoadApi(load_settings) as api:
        if not api.has_database:
            pytest.skip("Нужен доступ к БД через LOAD_DB_URL или DATABASE_URL")
        worlds = await prepare_expert_order_worlds(api, "expert-update-prepare", load_settings.total_iterations)
        try:
            async def execute(iteration: int) -> None:
                world = worlds[iteration]
                if world.response is None:
                    raise RuntimeError("Не подготовлен отклик для смены статуса экспертом")
                await api.update_response_status(world.expert, world.response.id, "COMPLETED")

            report = await run_scenario("expert-order-update", load_settings, execute)
            assert_report(report, load_settings)
        finally:
            await close_response_worlds(worlds)
