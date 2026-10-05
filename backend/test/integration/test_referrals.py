"""Проверяет реальные транзакции и параллельные начисления без моков БД."""

import asyncio
import importlib.util
from dataclasses import dataclass
from pathlib import Path

import pytest
from fastapi import HTTPException
from sqlalchemy import delete, func, select
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from alembic.migration import MigrationContext
from alembic.operations import Operations
from models.account import Account, UserRole
from models.expert import Expert
from models.referral import BonusAccount, BonusTransaction, Referral, ReferralCampaign
from models.research import ExpertResearchProfile
from schemas.referral import ReferralCounts
from services.referrals import (
    BonusRepository,
    GetReferralOverviewUseCase,
    ReferralRepository,
    ReferralValidator,
    RegisterReferralUseCase,
    RewardReferralUseCase,
)

pytestmark = pytest.mark.integration
SessionFactory = async_sessionmaker[AsyncSession]


@dataclass
class Participants:
    """ID участников и публичный код пригласившего."""

    inviter_id: int
    invited_ids: list[int]
    referral_code: str


@dataclass
class ProgramState:
    """Согласованное состояние фонда, бонусного счёта и журнала."""

    balance_kopecks: int
    spent_kopecks: int
    transactions_count: int
    counts: ReferralCounts


async def create_program(
    sessions: SessionFactory,
    invited_count: int = 1,
    total_kopecks: int = 100_000_000,
    email_verified: bool = True,
    profile_filled: bool = True,
) -> Participants:
    """Создаёт фонд, пригласившего и указанное количество новых исполнителей."""
    async with sessions.begin() as db:
        campaign = ReferralCampaign(id=1, total_kopecks=total_kopecks, reward_kopecks=300_000)
        inviter = Account(
            email="inviter@example.com",
            role=UserRole.EXPERT,
            password="unused",
            first_name="Иван",
            email_verified=True,
            is_active=True,
            expert_profile=Expert(certificates=[]),
        )
        db.add_all([campaign, inviter])
        await db.flush()

        invited_ids = []
        for index in range(invited_count):
            invited = Account(
                email=f"invited{index}@example.com",
                role=UserRole.EXPERT,
                password="unused",
                first_name="Пётр",
                email_verified=email_verified,
                is_active=True,
                expert_profile=Expert(
                    certificates=[],
                    research_profile=ExpertResearchProfile(research_field="НИР" if profile_filled else ""),
                ),
            )
            db.add(invited)
            await db.flush()
            db.add(
                Referral(
                    inviter_id=inviter.id,
                    invited_id=invited.id,
                    invited_email=invited.email,
                )
            )
            invited_ids.append(invited.id)

        return Participants(inviter.id, invited_ids, inviter.public_id)


def reward_use_case(db: AsyncSession) -> RewardReferralUseCase:
    """Собирает начисление на одной сессии БД."""
    repo = ReferralRepository(db)
    return RewardReferralUseCase(repo, ReferralValidator(repo), BonusRepository(db))


async def reward(sessions: SessionFactory, invited_id: int) -> None:
    """Начисляет бонус и завершает отдельную транзакцию."""
    async with sessions.begin() as db:
        await reward_use_case(db).execute(invited_id)


async def read_state(sessions: SessionFactory, inviter_id: int) -> ProgramState:
    """Читает итоговые суммы и количество операций после коммита."""
    async with sessions() as db:
        repo = ReferralRepository(db)
        campaign = await repo.get_campaign()
        result = await db.execute(select(func.count(BonusTransaction.id)))
        return ProgramState(
            balance_kopecks=await BonusRepository(db).get_balance(inviter_id),
            spent_kopecks=campaign.spent_kopecks,
            transactions_count=result.scalar_one(),
            counts=await repo.count_by_status(inviter_id),
        )


async def test_repeated_reward_is_credited_once(sessions: SessionFactory) -> None:
    participants = await create_program(sessions)

    await reward(sessions, participants.invited_ids[0])
    await reward(sessions, participants.invited_ids[0])

    state = await read_state(sessions, participants.inviter_id)
    assert state.balance_kopecks == 300_000
    assert state.spent_kopecks == 300_000
    assert state.transactions_count == 1
    assert state.counts.rewarded_count == 1


async def test_parallel_reward_is_credited_once(sessions: SessionFactory) -> None:
    participants = await create_program(sessions)
    invited_id = participants.invited_ids[0]

    await asyncio.gather(reward(sessions, invited_id), reward(sessions, invited_id))

    state = await read_state(sessions, participants.inviter_id)
    assert state.balance_kopecks == 300_000
    assert state.spent_kopecks == 300_000
    assert state.transactions_count == 1


async def test_parallel_requests_cannot_exceed_pool(sessions: SessionFactory) -> None:
    participants = await create_program(sessions, invited_count=2, total_kopecks=300_000)

    await asyncio.gather(
        reward(sessions, participants.invited_ids[0]),
        reward(sessions, participants.invited_ids[1]),
    )

    state = await read_state(sessions, participants.inviter_id)
    assert state.spent_kopecks == 300_000
    assert state.balance_kopecks == 300_000
    assert state.transactions_count == 1
    assert state.counts.rewarded_count == 1
    assert state.counts.pool_exhausted_count == 1


async def test_rollback_restores_balance_pool_and_referral(sessions: SessionFactory) -> None:
    participants = await create_program(sessions)

    async with sessions() as db:
        await reward_use_case(db).execute(participants.invited_ids[0])
        await db.rollback()

    state = await read_state(sessions, participants.inviter_id)
    assert state.balance_kopecks == 0
    assert state.spent_kopecks == 0
    assert state.transactions_count == 0
    assert state.counts.pending_count == 1


@pytest.mark.parametrize("missing_condition", ["email", "profile"])
async def test_incomplete_registration_waits_for_conditions(
    sessions: SessionFactory,
    missing_condition: str,
) -> None:
    participants = await create_program(
        sessions,
        email_verified=missing_condition != "email",
        profile_filled=missing_condition != "profile",
    )

    await reward(sessions, participants.invited_ids[0])
    state = await read_state(sessions, participants.inviter_id)
    assert state.balance_kopecks == 0
    assert state.counts.pending_count == 1

    async with sessions.begin() as db:
        invited = await ReferralRepository(db).find_account(participants.invited_ids[0])
        invited.email_verified = True
        invited.expert_profile.research_profile.research_field = "НИР"
        await reward_use_case(db).execute(invited.id)

    state = await read_state(sessions, participants.inviter_id)
    assert state.balance_kopecks == 300_000
    assert state.counts.rewarded_count == 1


async def test_paused_campaign_keeps_pending_status(sessions: SessionFactory) -> None:
    participants = await create_program(sessions)
    async with sessions.begin() as db:
        campaign = await ReferralRepository(db).get_campaign()
        campaign.is_active = False

    await reward(sessions, participants.invited_ids[0])

    state = await read_state(sessions, participants.inviter_id)
    assert state.balance_kopecks == 0
    assert state.counts.pending_count == 1


async def test_disabled_inviter_does_not_receive_bonus(sessions: SessionFactory) -> None:
    participants = await create_program(sessions)
    async with sessions.begin() as db:
        inviter = await ReferralRepository(db).find_account(participants.inviter_id)
        inviter.is_active = False

    await reward(sessions, participants.invited_ids[0])

    state = await read_state(sessions, participants.inviter_id)
    assert state.balance_kopecks == 0
    assert state.counts.rejected_count == 1


async def test_email_change_does_not_confirm_original_invitation(sessions: SessionFactory) -> None:
    participants = await create_program(sessions, email_verified=False)
    async with sessions.begin() as db:
        invited = await ReferralRepository(db).find_account(participants.invited_ids[0])
        invited.email = "different@example.com"
        invited.email_verified = True

    await reward(sessions, participants.invited_ids[0])

    state = await read_state(sessions, participants.inviter_id)
    assert state.balance_kopecks == 0
    assert state.counts.pending_count == 1


async def test_deleted_account_cannot_participate_again(sessions: SessionFactory) -> None:
    participants = await create_program(sessions)
    await reward(sessions, participants.invited_ids[0])
    async with sessions.begin() as db:
        await db.execute(delete(Account).where(Account.id == participants.invited_ids[0]))

    async with sessions() as db:
        repo = ReferralRepository(db)
        use_case = RegisterReferralUseCase(repo, ReferralValidator(repo))
        with pytest.raises(HTTPException, match="уже участвовал"):
            await use_case.prepare(participants.referral_code, "invited0@example.com", UserRole.EXPERT)

    state = await read_state(sessions, participants.inviter_id)
    assert state.transactions_count == 1
    assert state.counts.rewarded_count == 1


async def test_overview_has_typed_counters_and_internal_balance(sessions: SessionFactory) -> None:
    participants = await create_program(sessions, invited_count=2)
    await reward(sessions, participants.invited_ids[0])
    async with sessions() as db:
        repo = ReferralRepository(db)
        use_case = GetReferralOverviewUseCase(
            repo, ReferralValidator(repo), BonusRepository(db), "https://example.com/"
        )
        overview = await use_case.execute(participants.inviter_id)

    assert overview.referral_url == f"https://example.com/register?ref={participants.referral_code}"
    assert overview.balance_kopecks == 300_000
    assert overview.invited_count == 2
    assert overview.pending_count == 1
    assert overview.rewarded_count == 1
    assert overview.withdrawal_allowed is False


async def test_migration_upgrade_and_downgrade(sessions: SessionFactory) -> None:
    path = Path(__file__).resolve().parents[2] / "alembic/versions/174_expert_referrals.py"
    spec = importlib.util.spec_from_file_location("referral_migration", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)

    def run_migration(connection: Connection) -> None:
        """Проверяет upgrade/downgrade только в изолированной схеме текущего теста."""
        for table in [
            BonusTransaction.__table__,
            BonusAccount.__table__,
            Referral.__table__,
            ReferralCampaign.__table__,
        ]:
            table.drop(connection)
        context = MigrationContext.configure(connection)
        with Operations.context(context):
            migration.upgrade()
            row = connection.execute(select(ReferralCampaign.__table__)).one()
            assert row.total_kopecks == 100_000_000
            assert row.reward_kopecks == 300_000
            migration.downgrade()
            migration.upgrade()

    async with sessions.begin() as db:
        connection = await db.connection()
        await connection.run_sync(run_migration)

    async with sessions() as db:
        campaign = await ReferralRepository(db).get_campaign()
        assert campaign.remaining_kopecks == 100_000_000
