import Image from "next/image";
import { formatPluses, type ReferralOverview } from "@/source/entities/referral";
import s from "./ReferralStats.module.scss";

interface ReferralStatsProps {
  overview: ReferralOverview;
}

/** Итоги приглашений: баланс плюсов, сколько приглашено и сколько бонусов начислено. */
export function ReferralStats({ overview }: ReferralStatsProps) {
  const stats = [
    { label: "Ваши плюсы", value: formatPluses(overview.balance_points), image: "/referral-balance.webp" },
    { label: "Приглашено", value: overview.invited_count, image: "/referral-invited.webp" },
    { label: "Бонус начислен", value: overview.rewarded_count, image: "/referral-rewarded.webp" },
  ];

  return (
    <section className={s.section} aria-label="Результаты приглашений">
      <h3 className={s.title}>Ваши приглашения</h3>
      <dl className={s.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={s.stat}>
            <dt className={s.label}>{stat.label}</dt>
            <dd className={s.value}>
              {stat.value}
              <Image src={stat.image} alt="" width={120} height={120} className={s.image} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
