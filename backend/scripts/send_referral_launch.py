"""Разовая рассылка исполнителям о запуске реферальной программы.

python -m scripts.send_referral_launch --test me@example.com   письмо только себе
python -m scripts.send_referral_launch --dry-run               сколько получателей, без отправки
python -m scripts.send_referral_launch --send                  разослать всем
python -m scripts.send_referral_launch --send --after a@b.ru   продолжить после адреса из лога
python -m scripts.send_referral_launch --send --news-off       разослать исполнителям, отключившим новостные письма
"""

import argparse
import asyncio
import logging

from database.database import AsyncSessionLocal
from services.email import EmailRepository, SendReferralLaunchEmailUseCase
from services.referrals import ReferralRepository


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Анонс реферальной программы исполнителям")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--test", metavar="EMAIL", help="отправить одно письмо на указанный адрес")
    mode.add_argument("--dry-run", action="store_true", help="показать получателей, ничего не отправляя")
    mode.add_argument("--send", action="store_true", help="разослать всем получателям")
    parser.add_argument("--after", metavar="EMAIL", help="продолжить рассылку после этого адреса")
    parser.add_argument(
        "--news-off",
        action="store_true",
        help="только исполнители, отключившие новостные письма: основная рассылка их пропускает",
    )
    return parser.parse_args()


async def main(args: argparse.Namespace) -> None:
    async with AsyncSessionLocal() as db:
        campaign = await ReferralRepository(db).get_campaign()
        use_case = SendReferralLaunchEmailUseCase(
            EmailRepository(db), campaign.reward_points, campaign.total_points
        )
        news_enabled = not args.news_off

        if args.test:
            delivered = await use_case.send(args.test, "")
            print("Тестовое письмо отправлено" if delivered else "Ошибка отправки, см. лог выше")
        elif args.dry_run:
            recipients = await use_case.list_recipients(args.after, news_enabled)
            print(f"Получателей: {len(recipients)}")
            for account in recipients[:10]:
                print(f"  {account.email}")
        else:
            sent = await use_case.execute(args.after, news_enabled)
            print(f"Отправлено писем: {sent}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    asyncio.run(main(parse_args()))
