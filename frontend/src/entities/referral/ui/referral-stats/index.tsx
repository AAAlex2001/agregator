import Image from "next/image";
import { formatPluses } from "../../model/format-pluses";
import type { ReferralOverview } from "../../model/types";
import styles from "./style.module.scss";

/** Баланс и результаты приглашений, полученные от сервера. */
interface ReferralStatsProps {
  overview: ReferralOverview;
}

/** Показывает баланс плюсов, количество приглашённых и начисленных бонусов. */
export function ReferralStats({ overview }: ReferralStatsProps) {
  const stats = [
    {
      label: "Ваши плюсы",
      value: formatPluses(overview.balance_points),
      image: "/referral-balance.webp",
    },
    {
      label: "Приглашено",
      value: overview.invited_count,
      image: "/referral-invited.webp",
    },
    {
      label: "Бонус начислен",
      value: overview.rewarded_count,
      image: "/referral-rewarded.webp",
    },
  ];

  return (
    <section
      className={styles.section}
      aria-label="Результаты приглашений"
    >
      <h3 className={styles.title}>Ваши приглашения</h3>
      <dl className={styles.stats}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={styles.stat}
          >
            <dt className={styles.label}>{stat.label}</dt>
            <dd className={styles.value}>
              {stat.value}
              <Image
                src={stat.image}
                alt=""
                width={120}
                height={120}
                className={styles.image}
              />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
