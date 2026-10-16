import Image from "next/image";
import { useId } from "react";
import { formatPluses } from "@/entities/referral";
import type { ReferralOverview } from "@/entities/referral";
import { CopyReferralLink } from "@/features/copy-referral-link";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Пояснение условий начисления бонуса за приглашённого коллегу. */
const INVITE_DESCRIPTION =
  "Поделитесь ссылкой с теми, кому доверяете. За каждого нового исполнителя, "
  + "выполнившего условия программы, начислим бонус для оплаты услуг платформы.";

/** Вознаграждение и ссылка приглашения текущего исполнителя. */
interface ReferralInviteProps {
  overview: ReferralOverview;
}

/** Собирает предложение пригласить коллегу и действие копирования ссылки. */
export function ReferralInvite({ overview }: ReferralInviteProps) {
  const id = useId();

  return (
    <div className={styles.card}>
      <div className={styles.copy}>
        <div className={styles.hero}>
          <span className={styles.reward}>+{formatPluses(overview.reward_points)}</span>
          <Title
            id={`${id}-title`}
            text="Приглашайте коллег, получайте плюсы"
            as="h2"
            className={styles.title}
          />
          <Subtitle
            text={INVITE_DESCRIPTION}
            className={styles.description}
          />
        </div>
        {!overview.accepting_referrals && (
          <p
            className={styles.notice}
            role="status"
          >
            Начисление новых плюсов приостановлено. Накопленные плюсы сохранены.
          </p>
        )}
        <CopyReferralLink
          link={overview.referral_url}
          inputId={`${id}-link`}
        />
      </div>
      <div className={styles.artwork}>
        <Image
          src="/referral-colleagues.webp"
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 1440px) 600px, (min-width: 768px) 50vw, 100vw"
          className={styles.illustration}
        />
      </div>
    </div>
  );
}
